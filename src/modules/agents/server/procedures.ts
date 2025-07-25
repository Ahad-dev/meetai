import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agents } from "@/db/schema";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { agentInsertSchema, agentsUpdateSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
  remove:protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removeAgent] = await db
      .delete(agents)
      .where(
        and(
          eq(agents.id,input.id),
          eq(agents.userId,ctx.auth.user.id)
        )
      )
      .returning();

      if(!removeAgent){
        throw new TRPCError ({
          code:'NOT_FOUND',
          message:"Not Fount"
        })
      }

      return removeAgent;

    }),
    update: protectedProcedure
      .input(agentsUpdateSchema)
      .mutation(async({input,ctx})=>{
        const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
          and(
            eq(agents.id,input.id),
            eq(agents.userId,ctx.auth.user.id)
          )
        )
        .returning()
        if(!updatedAgent){
          throw new TRPCError({
            code:"NOT_FOUND",
            message:"Agent Not Found "
          })
        }
      })
    ,
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input,ctx }) => {
      const [existingAgent] = await db
        .select({
          // TODO: Meeting Count get here
          ...getTableColumns(agents),
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId,ctx.auth.user.id)
          )
        );

      return existingAgent;
    }),
  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z.number().default(DEFAULT_PAGE),
          pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
          search: z.string().nullish(),
        })
    )
    .query(async ({ctx,input}) => {
      const {search, page, pageSize} = input;
      const data = await db
        .select({
          // TODO: Meeting Count get here
          ...getTableColumns(agents),
          meetingCount: sql<number>`6`,
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`):undefined
          )
        )
        .orderBy(desc(agents.createdAt),desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

        const [totalCount] = await db
        .select({count:count()})
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`):undefined
          )
        )

        const totalPages = Math.ceil(totalCount.count / pageSize);
        return {
          items:data,
          total: totalCount.count,
          totalPages,
        }

      // throw new TRPCError({code:"BAD_REQUEST"})

    }),
  create: protectedProcedure
    .input(agentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return createAgent;
    }),
});

import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agents, meetings } from "@/db/schema";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const meetingRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input,ctx }) => {
      const [existingMeeting] = await db
        .select({
          // TODO: Meeting Count get here
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.id, input.id),
            eq(meetings.userId,ctx.auth.user.id)
          )
        );

      return existingMeeting;
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
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`):undefined
          )
        )
        .orderBy(desc(meetings.createdAt),desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

        const [totalCount] = await db
        .select({count:count()})
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`):undefined
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
});

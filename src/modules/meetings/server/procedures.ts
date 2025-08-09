import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agents, meetings } from "@/db/schema";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { meetingInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";

export const meetingRouter = createTRPCRouter({
  update: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();
      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting Not Found ",
        });
      }
    }),
  create: protectedProcedure
    .input(meetingInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      // TODO: create Stream call Upsert Steram Users

      return createdMeeting;
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingMeeting] = await db
        .select({
          // TODO: Meeting Count get here
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      return existingMeeting;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId:z.string().nullish(),
        status:z
        .enum([
          MeetingStatus.Upcoming,
          MeetingStatus.Active,
          MeetingStatus.Cancelled,
          MeetingStatus.Completed,
          MeetingStatus.Processing,
        ]).nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize,status,agentId } = input;

      const conditions = [eq(meetings.userId, ctx.auth.user.id)];
      if (search) {
        conditions.push(ilike(meetings.name, `%${search}%`));
      }
      if(status){
        conditions.push(eq(meetings.status,status))
      }
      if(agentId){
        conditions.push(eq(meetings.agentId,agentId))
      }

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id)) // <-- fixed join
        .where(and(...conditions))
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalCount] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id)) // <-- fixed join
        .where(and(...conditions));

      const total = Number(totalCount.count);
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: data,
        total,
        totalPages,
      };
    }),
});

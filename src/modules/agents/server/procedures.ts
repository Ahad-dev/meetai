import { createTRPCRouter,baseProcedure } from "@/trpc/init";
import { agents } from "@/db/schema";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    getMany:baseProcedure.query(async ()=>{
        const data = await db.select().from(agents);

        // throw new TRPCError({code:"BAD_REQUEST"})

        return data;
    }),
})
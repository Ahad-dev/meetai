import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
   let session = null;

  try {
    const requestHeaders = await headers(); // throws if no request
    session = await auth.api.getSession({
      headers: requestHeaders,
    });
  } catch {
    // Running in static context like generateStaticParams
    session = null;
  }

  return {
    auth: session,
  };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.auth) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource.',
    });
  }

  return next({
    ctx:{
      ...ctx,
      auth: ctx.auth, // ✅ no need to reattach session — already in ctx
    } 
  });
});
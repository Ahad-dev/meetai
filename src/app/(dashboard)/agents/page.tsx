import { auth } from '@/lib/auth';
import ListHeader from '@/modules/agents/ui/components/list-header';
import AgentsView, { AgentViewError, AgentViewLoading } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'
import {ErrorBoundary}  from  "react-error-boundary"

const page = async() => {


  const session = await auth.api.getSession({
    headers:await headers()
  });
  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());



  return (
    <>
      <ListHeader></ListHeader>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentViewLoading/>}>
          <ErrorBoundary fallback = {<AgentViewError/>}>
            <AgentsView></AgentsView>
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default page
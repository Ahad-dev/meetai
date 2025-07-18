import { auth } from '@/lib/auth';
import { loadSearchParams } from '@/modules/agents/params';
import ListHeader from '@/modules/agents/ui/components/list-header';
import AgentsView, { AgentViewError, AgentViewLoading } from '@/modules/agents/ui/views/agents-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs';
import React, { Suspense } from 'react'
import {ErrorBoundary}  from  "react-error-boundary"

interface Props {
  searchParams:Promise<SearchParams>
}

const page = async({searchParams}:Props) => {

  const filters = await loadSearchParams(searchParams)


  const session = await auth.api.getSession({
    headers:await headers()
  });
  if (!session) {
    redirect("/sign-in");
  }

  const queryClient =  getQueryClient();
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    ...filters,
  }));



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
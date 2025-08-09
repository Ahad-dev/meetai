import { loadSearchParams } from '@/modules/agents/params'
import ListHeader from '@/modules/meetings/ui/components/list-header'
import MeetingsView, { MeetingViewError, MeetingViewLoading } from '@/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { SearchParams } from 'nuqs'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({searchParams}:Props) => {

    const filters = await loadSearchParams(searchParams)
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
            ...filters
        })
    )
  return (
    <>  
        <ListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingViewLoading/>}>
                <ErrorBoundary fallback={<MeetingViewError/>}>
                    <MeetingsView/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    </>
  )
}

export default Page
import MeetingsView, { MeetingViewError, MeetingViewLoading } from '@/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const Page = async () => {
    const queryClient = getQueryClient()
    await queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingViewLoading/>}>
            <ErrorBoundary fallback={<MeetingViewError/>}>
                <MeetingsView/>
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
  )
}

export default Page
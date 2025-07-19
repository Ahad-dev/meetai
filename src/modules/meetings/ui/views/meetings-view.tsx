"use client"
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'

const MeetingsView = () => {
    const trpc = useTRPC();
    
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))
  return (
    <div>{JSON.stringify(data)}</div>
  )
}


export const MeetingViewLoading= ()=>{
  return(
    <LoadingState title='Loading Meetings' description='This may take a few seconds... '/>
  )
}

export const MeetingViewError = ()=>{
  return (
        <ErrorState
        title='Error Loading Meetings'
        description='Please Try again Later'
        />
  )
}

export default MeetingsView

// ZecC4anVWxaRiMAMYh0r7g0AiilMmdSG
// gxx4QQWG-3ySxO07orbna
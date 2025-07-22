"use client"
import { DataTable } from '@/components/data-table';
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import { columns } from '../components/columns';
import EmptyState from '@/components/empty-state';

const MeetingsView = () => {
    const trpc = useTRPC();
    
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))
    console.log(data)
  return (
    <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4'>
      <DataTable 
        columns={columns}
        data = {data.items}/>
        {data.items.length === 0 && (
            <EmptyState
              title='Create Your First Meeting '
              description='Schedule a meeting with your agent. Each meeting will be recorded and you can access it later.'
            />
          )}
    </div>
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
"use client"
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client'
import {useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import { DataTable } from '../components/data-table';
import { columns } from '../components/columns';
import EmptyState from '@/components/empty-state';



const AgentsView = () => {

  const trpc = useTRPC();
  const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());


  // const {data,isLoading,isError} = useQuery(trpc.agents.getMany.queryOptions());

  // if(isLoading){
  //   return <LoadingState title='Loading Agents' description='This may take a few seconds... '/>
  // }

  // if(isError){
  //   return (
  //     <ErrorState
  //       title='Error Loading Agents'
  //       description='Please Try again Later'
  //       />
  //   )
  // }
  return (
    <div className='flex-1 pb-4 px-4 md:px-8 flex flex-col gap-4'>
      <DataTable
        data={data}
        columns={columns}
      />
      {data.length === 0 && (
        <EmptyState
          title='Create Your First Agent'
          description='Create an Agent and give him the instruction so it can work as you said to it'
        />
      )}
      </div>
  )
}

export const AgentViewLoading= ()=>{
  return(
    <LoadingState title='Loading Agents' description='This may take a few seconds... '/>
  )
}

export const AgentViewError = ()=>{
  return (
        <ErrorState
        title='Error Loading Agents'
        description='Please Try again Later'
        />
  )
}

export default AgentsView
"use client"
import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client'
import {useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'
import { columns } from '../components/columns';
import EmptyState from '@/components/empty-state';
import { useAgentsFilters } from '@/hooks/use-agents-filters';
import DataPagination from '../components/data-pagination';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data-table';



const AgentsView = () => {
  const [filters,setFilters] = useAgentsFilters();
  const router = useRouter()

  const trpc = useTRPC();
  const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions({
    ...filters,
  }));


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
        data={data.items}
        columns={columns}
        onRowClick={(row)=> router.push(`/agents/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({page})}

      />
      {data.items.length === 0 && (
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
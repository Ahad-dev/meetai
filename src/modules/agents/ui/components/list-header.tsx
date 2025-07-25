"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import NewAgentDialog from './new-agent-dialog'
import { useAgentsFilters } from '@/hooks/use-agents-filters'
import AgentSearchFilters from './agents-search-filters'
import { DEFAULT_PAGE } from '@/constants'

const ListHeader = () => {
  const [filters,setFilters] = useAgentsFilters()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isAnyFilterModified = !!filters.search;
  const onClearFilters = ()=>{
    setFilters({
      search:"",
      page:DEFAULT_PAGE
    })
  }
  return (
    <>
    <NewAgentDialog 
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
    />
    <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
      <div className='flex items-center justify-between'>
        <h5 className='font-medium'>My Agents</h5>
        <Button 
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusIcon></PlusIcon>
           New Agent</Button>
      </div>
      <div className='flex items-center gap-x-2 p-1'>
        <AgentSearchFilters/>
        {isAnyFilterModified && (
          <Button 
            variant='outline'
            size='sm'
            onClick={onClearFilters}
          >
           <XCircleIcon/> Clear
          </Button>
        )}
      </div>
    </div>
    </>
  )
}

export default ListHeader
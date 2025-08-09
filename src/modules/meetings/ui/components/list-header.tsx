"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import NewMeetingDialog from './new-meeting-dialog'
import MeetingSearchFilters from './meetings-search-filters'
import { StatusFilter } from './status-filter'
import { AgentIdFilter } from './agent-id-filter'
import { useMeetingsFilters } from '../../hooks/use-meetings-filters'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const ListHeader = () => {
  const [filter,setFilters]  = useMeetingsFilters()  
  const [isDialogOpen,setIsDialogOpen] = useState(false);

  const isAnyFilterApplied = 
  !!filter.agentId || !!filter.search || !!filter.status

  const onClearFilter = ()=>{
    setFilters({
      status:null,
      agentId:"",
      search:"",
      page:1
    })
  }
  return (
    <>
    <NewMeetingDialog
      onOpenChange={setIsDialogOpen}
      open={isDialogOpen}
    />
    <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
      <ScrollArea>

      <div className='flex items-center justify-between'>
        <h5 className='font-medium'>My Meetings</h5>
        <Button 
          onClick={()=>setIsDialogOpen(true)}
        >
          <PlusIcon></PlusIcon>
           New Meeting</Button>
      </div>
      <div className='flex items-center gap-x-2 p-1'>
        <MeetingSearchFilters/>
        <StatusFilter/>
        <AgentIdFilter/>
        {
          isAnyFilterApplied&& (
            <Button variant={"outline"} onClick={onClearFilter}>
              <XCircleIcon className='size-4'/>
              Clear
            </Button>
          )
        }
      </div>
      <ScrollBar orientation="horizontal" />
      </ScrollArea>

    </div>
    </>
  )
}

export default ListHeader
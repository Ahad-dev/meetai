"use client"
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import NewMeetingDialog from './new-meeting-dialog'

const ListHeader = () => {
  const [isDialogOpen,setIsDialogOpen] = useState(false);

  return (
    <>
    <NewMeetingDialog
      onOpenChange={setIsDialogOpen}
      open={isDialogOpen}
    />
    <div className='py-4 px-4 md:px-8 flex flex-col gap-y-4'>
      <div className='flex items-center justify-between'>
        <h5 className='font-medium'>My Meetings</h5>
        <Button 
          onClick={()=>setIsDialogOpen(true)}
        >
          <PlusIcon></PlusIcon>
           New Agent</Button>
      </div>
      <div className='flex items-center gap-x-2 p-1'>

      </div>
    </div>
    </>
  )
}

export default ListHeader
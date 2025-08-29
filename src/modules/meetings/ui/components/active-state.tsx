import EmptyState from '@/components/empty-state'
import React from 'react'
import { Button } from '@/components/ui/button'
import {  VideoIcon } from 'lucide-react'
import Link from 'next/link'

interface Props {
    meetingId:String
}

const ActiveState = ({
    meetingId,

}:Props) => {
  return (
    <div
        className='bg-white items-center flex rounded-lg px-4 py-5 flex-col gap-y-8'
    ><EmptyState 
        image='/upcoming.svg'
        title='Meeting is active'
        description='Meeting will ended when all participants leave'

    />
    <div className='flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full'>
        <Button asChild className='w-full lg:w-auto'>
            <Link href={`/call/${meetingId}`}>
                <VideoIcon/>
                <span>Join Meeting</span>
            </Link>
        </Button>
    </div>

    </div>
  )
}

export default ActiveState
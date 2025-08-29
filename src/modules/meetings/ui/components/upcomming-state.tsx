import EmptyState from '@/components/empty-state'
import React from 'react'
import { Button } from '@/components/ui/button'
import { BanIcon, VideoIcon } from 'lucide-react'
import Link from 'next/link'

interface Props {
    meetingId:String
    onCancelMeeting: () => void
    isCancelling:boolean
}

const UpcommingState = ({
    meetingId,
    onCancelMeeting,
    isCancelling
}:Props) => {
  return (
    <div
        className='bg-white items-center flex rounded-lg px-4 py-5 flex-col gap-y-8'
    ><EmptyState 
        image='/upcoming.svg'
        title='Not started yet'
        description='Once you start this meeting, a summary will appear here'

    />
    <div className='flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full'>
        <Button 
            variant={"secondary"}
            className='w-full lg:w-auto'
            onClick={onCancelMeeting}
            disabled={isCancelling}
            >

            <BanIcon/>
            <span>Cancel Meeting</span>
        </Button>
        <Button disabled={isCancelling} asChild className='w-full lg:w-auto'>
            <Link href={`/call/${meetingId}`}>
                <VideoIcon/>
                <span>Start Meeting</span>
            </Link>
        </Button>
    </div>

    </div>
  )
}

export default UpcommingState
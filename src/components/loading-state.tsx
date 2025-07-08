import { Loader2Icon } from 'lucide-react'
import React from 'react'

interface Props {
    title:string,
    description:string
}

const LoadingState = ({
    title,
    description
}:Props) => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
        <div className='flex py-4 px-8 h-2/6 flex-col items-center justify-center gap-y-6 bg-background rounded-lg'>
            <Loader2Icon className='size-6 animate-spin text-primary'/>
            <div className='flex flex-col gap-y-2 text-center'>
                <h6 className='text-lg font-medium'>{title}</h6>
                <p className='text-sm'>{description}</p>
            </div>

        </div>
    </div>
  )
}

export default LoadingState
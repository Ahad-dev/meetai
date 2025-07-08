import { AlertCircleIcon } from 'lucide-react'
import React from 'react'

interface Props {
    title:string,
    description:string
}

const ErrorState = ({
    title,
    description
}:Props) => {
  return (
    <div className='flex flex-1 items-center justify-center w-full h-full my-32'>
        <div className='flex py-4 px-8 h-2/6 flex-col items-center justify-center gap-y-6 bg-background rounded-lg'>
            <AlertCircleIcon className='size-6 text-destructive'/>
            <div className='flex flex-col gap-y-2 text-center'>
                <h6 className='text-lg font-medium'>{title}</h6>
                <p className='text-sm'>{description}</p>
            </div>

        </div>
    </div>
  )
}

export default ErrorState
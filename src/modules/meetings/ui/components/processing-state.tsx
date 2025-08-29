import EmptyState from '@/components/empty-state'
import React from 'react'

const ProcessingState = () => {
  return (
    <div
        className='bg-white items-center flex rounded-lg px-4 py-5 flex-col gap-y-8'
    ><EmptyState 
        image='/processing.svg'
        title='Meeting is in processing'
        description='Meeting is in processing'

    />

    </div>
  )
}

export default ProcessingState
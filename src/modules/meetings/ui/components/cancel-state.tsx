import EmptyState from '@/components/empty-state'
import React from 'react'

const CancelState = () => {
  return (
    <div
        className='bg-white items-center flex rounded-lg px-4 py-5 flex-col gap-y-8'
    ><EmptyState 
        image='/cancelled.svg'
        title='Meeting is Cancelled'
        description='Meeting is Cancelled'
    />

    </div>
  )
}

export default CancelState
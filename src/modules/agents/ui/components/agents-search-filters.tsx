import { Input } from '@/components/ui/input'
import { useAgentsFilters } from '@/hooks/use-agents-filters'
import { SearchIcon } from 'lucide-react'
import React from 'react'

const AgentSearchFilters = () => {
    const [filters, setFilters] = useAgentsFilters()
  return (
    <div className='relative'>
        <Input
            placeholder='Filter by Name'
            value={filters.search}
            className='h-9 bg-white w-[200px] pl-7'
            onChange={(e) => setFilters({ search: e.target.value })}
        />
        <SearchIcon
            className='size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground'
        />
    </div>
  )
}

export default AgentSearchFilters
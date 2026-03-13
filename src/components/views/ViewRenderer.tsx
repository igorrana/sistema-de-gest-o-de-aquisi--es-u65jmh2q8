import { useMemo } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import useAppStore from '@/stores/useAppStore'
import { PurchaseRequest } from '@/types'
import { TableView } from './TableView'
import { KanbanView } from './KanbanView'

interface ViewRendererProps {
  requests: PurchaseRequest[]
  onRowClick: (id: string) => void
}

export function ViewRenderer({ requests, onRowClick }: ViewRendererProps) {
  const { currentUser } = useAuthStore()
  const { globalSearch } = useAppStore()

  const filteredRequests = useMemo(() => {
    if (!globalSearch) return requests
    const lower = globalSearch.toLowerCase()
    return requests.filter(
      (r) =>
        r.description.toLowerCase().includes(lower) ||
        (r.request_number && r.request_number.toLowerCase().includes(lower)) ||
        (r.order_number && r.order_number.toLowerCase().includes(lower)),
    )
  }, [requests, globalSearch])

  if (currentUser?.view_preference === 'kanban') {
    return <KanbanView requests={filteredRequests} onCardClick={onRowClick} />
  }

  return <TableView requests={filteredRequests} onRowClick={onRowClick} />
}

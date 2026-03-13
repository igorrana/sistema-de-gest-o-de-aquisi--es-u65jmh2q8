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
    let result = requests

    if (globalSearch) {
      const lower = globalSearch.toLowerCase()
      result = result.filter(
        (r) =>
          r.description.toLowerCase().includes(lower) ||
          (r.request_number && r.request_number.toLowerCase().includes(lower)) ||
          (r.order_number && r.order_number.toLowerCase().includes(lower)),
      )
    }

    // Sorting Logic: Priority (P0 > P1 > P2), then Request Number
    const priorityWeight: Record<string, number> = { P0: 1, P1: 2, P2: 3 }

    return result.sort((a, b) => {
      const pA = priorityWeight[a.priority] || 99
      const pB = priorityWeight[b.priority] || 99
      if (pA !== pB) return pA - pB

      const numA = a.request_number || ''
      const numB = b.request_number || ''
      return numA.localeCompare(numB)
    })
  }, [requests, globalSearch])

  if (currentUser?.view_preference === 'kanban') {
    return <KanbanView requests={filteredRequests} onCardClick={onRowClick} />
  }

  return <TableView requests={filteredRequests} onRowClick={onRowClick} />
}

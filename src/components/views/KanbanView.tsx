import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { PurchaseRequest } from '@/types'
import useAppStore from '@/stores/useAppStore'
import useAuthStore from '@/stores/useAuthStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Clock, User, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface KanbanViewProps {
  requests: PurchaseRequest[]
  onCardClick: (id: string) => void
}

export function KanbanView({ requests, onCardClick }: KanbanViewProps) {
  const { statuses, users, permissions, updateRequest } = useAppStore()
  const { currentUser } = useAuthStore()
  const [draggedId, setDraggedId] = useState<string | null>(null)

  let activeStatuses = statuses
    .filter((s) => s.active)
    .sort((a, b) => a.order_index - b.order_index)

  if (currentUser?.current_role === 'solicitante') {
    activeStatuses = activeStatuses.filter((s) => s.id !== 's1')
  }

  const canEditStatus = currentUser
    ? permissions[currentUser.current_role].status_id === 'edit'
    : false

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDrop = (e: React.DragEvent, newStatusId: string) => {
    e.preventDefault()
    const reqId = e.dataTransfer.getData('text/plain')
    if (!reqId || !canEditStatus) {
      if (!canEditStatus) toast.error('Sem permissão para alterar status.')
      setDraggedId(null)
      return
    }

    const req = requests.find((r) => r.id === reqId)
    if (!req || req.status_id === newStatusId) {
      setDraggedId(null)
      return
    }

    const oldStatusId = req.status_id
    updateRequest(reqId, { status_id: newStatusId })
    toast.success('Card movido com sucesso', {
      action: {
        label: 'Desfazer',
        onClick: () => updateRequest(reqId, { status_id: oldStatusId }),
      },
      duration: 5000,
    })
    setDraggedId(null)
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'P0':
        return 'bg-red-100 text-red-800'
      case 'P1':
        return 'bg-orange-100 text-orange-800'
      case 'P2':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto h-full pb-4 px-1 snap-x">
      {activeStatuses.map((status) => {
        const colRequests = requests.filter((r) => r.status_id === status.id)
        const isDimmed = draggedId && !canEditStatus

        return (
          <div
            key={status.id}
            className={cn(
              'min-w-[320px] max-w-[320px] bg-slate-200/50 rounded-xl flex flex-col snap-center border border-slate-200 shadow-sm transition-opacity',
              isDimmed && 'opacity-50',
            )}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(e) => handleDrop(e, status.id)}
          >
            <div
              className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-100 rounded-t-xl"
              style={{ borderTop: `4px solid ${status.color}` }}
            >
              <h3 className="font-semibold text-slate-700">{status.name}</h3>
              <span className="bg-white text-slate-600 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                {colRequests.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {colRequests.map((r) => {
                const buyer = users.find((u) => u.id === r.buyer_id)
                return (
                  <Card
                    key={r.id}
                    onClick={() => onCardClick(r.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, r.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className="cursor-pointer hover:shadow-md transition-all active:cursor-grabbing border-slate-200"
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={cn('text-[10px] px-1.5 py-0', getPriorityColor(r.priority))}
                          >
                            {r.priority}
                          </Badge>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {r.request_number || 'S/N'}
                          </span>
                        </div>
                        <span
                          className="text-xs text-muted-foreground flex items-center gap-1"
                          title="Data de Necessidade"
                        >
                          <Clock className="w-3 h-3" />
                          {r.need_date
                            ? new Date(r.need_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                            : '-'}
                        </span>
                      </div>
                      <p className="font-medium text-sm leading-tight text-slate-800 mb-3 line-clamp-2">
                        {r.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">
                            {buyer ? buyer.name : 'Não atribuído'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

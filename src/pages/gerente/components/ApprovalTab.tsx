import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import useAppStore from '@/stores/useAppStore'
import { RequestDrawer } from '@/components/RequestDrawer'

export function ApprovalTab() {
  const { requests, projects, users, updateRequest } = useAppStore()
  const [selectedReq, setSelectedReq] = useState<string | null>(null)

  // Em Aprovação -> s1.5
  const pendingRequests = requests.filter((r) => r.status_id === 's1.5')

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const req = requests.find((r) => r.id === id)
    // If has buyer, go to s2, else also s2 (waiting for buyer) or s1.8
    // Requirements: Aprovar -> "Solicitação Aprovada" (s1.8).
    // And "Assigning a buyer automatically changes status to Aguardando Comprador".
    // Let's just set it to 's1.8', then if it has a buyer it will flow to s2 based on store logic, or we force it here.
    const newStatus = req?.buyer_id ? 's2' : 's1.8'
    updateRequest(id, { status_id: newStatus })
    toast.success('Solicitação Aprovada!')
  }

  const handleReject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app we'd open a modal for rejection reason, here we simulate with prompt or just toast for simplicity as modal is required
    const reason = window.prompt('Motivo da rejeição:')
    if (reason !== null) {
      updateRequest(id, { status_id: 's1' })
      toast.info('Solicitação rejeitada e retornada para Rascunho.')
    }
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-lg font-medium">Solicitações em Aprovação</h3>
      </div>

      <div className="border rounded-md bg-white flex-1 overflow-auto shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow>
              <TableHead>Prioridade</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Data Nec.</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Nenhuma solicitação aguardando aprovação.
                </TableCell>
              </TableRow>
            ) : (
              pendingRequests.map((r) => {
                const project = projects.find((p) => p.id === r.project_id)
                const requester = users.find((u) => u.id === r.requester_id)

                return (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelectedReq(r.id)}
                  >
                    <TableCell>
                      <Badge variant="outline">{r.priority}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">{r.description}</TableCell>
                    <TableCell className="text-slate-600 truncate max-w-[150px]">
                      {project?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-slate-600">{requester?.name || 'N/A'}</TableCell>
                    <TableCell className="text-slate-600">
                      {r.need_date
                        ? new Date(r.need_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={(e) => handleApprove(r.id, e)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={(e) => handleReject(r.id, e)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <RequestDrawer requestId={selectedReq} onClose={() => setSelectedReq(null)} />
    </div>
  )
}

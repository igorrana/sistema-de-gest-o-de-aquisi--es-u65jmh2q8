import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PurchaseRequest } from '@/types'
import useAppStore from '@/stores/useAppStore'
import { calculateDeadlineDays } from '@/lib/utils'

export function TableView({
  requests,
  onRowClick,
}: {
  requests: PurchaseRequest[]
  onRowClick: (id: string) => void
}) {
  const { statuses, users, projects } = useAppStore()

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'P0':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'P1':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'P2':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="border rounded-md bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Prioridade</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Projeto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Necessidade</TableHead>
            <TableHead>Comprador</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                Nenhuma solicitação encontrada.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((r) => {
              const status = statuses.find((s) => s.id === r.status_id)
              const buyer = users.find((u) => u.id === r.buyer_id)
              const project = projects.find((p) => p.id === r.project_id)
              const diffDays = calculateDeadlineDays(r.status_changed_at, status?.max_days)

              return (
                <TableRow
                  key={r.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => onRowClick(r.id)}
                >
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(r.priority)}>
                      {r.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">
                    {r.request_number || 'S/N'}
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">{r.description}</TableCell>
                  <TableCell className="text-slate-600 truncate max-w-[150px]">
                    {project?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: `${status?.color}15`,
                        color: status?.color,
                        borderColor: `${status?.color}30`,
                      }}
                    >
                      {status?.name || 'Desconhecido'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {diffDays === null ? (
                      <span className="text-muted-foreground">-</span>
                    ) : diffDays < 0 ? (
                      <Badge variant="destructive">Vencido ({-diffDays}d)</Badge>
                    ) : diffDays === 0 ? (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-300 bg-amber-50"
                      >
                        Vence hoje
                      </Badge>
                    ) : (
                      <span className="text-slate-600 font-medium">
                        {diffDays} {diffDays === 1 ? 'dia' : 'dias'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {r.need_date
                      ? new Date(r.need_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-slate-600">{buyer?.name || 'Não atribuído'}</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

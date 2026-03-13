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
import { toast } from 'sonner'
import useAppStore from '@/stores/useAppStore'
import useAuthStore from '@/stores/useAuthStore'

export function UsersTab() {
  const { users, requests, updateRequest } = useAppStore()
  const { currentUser } = useAuthStore()

  const isAdmin = currentUser?.current_role === 'admin'

  const handleAssignBuyers = () => {
    const unassigned = requests.filter(
      (r) => !r.buyer_id && (r.status_id === 's2' || r.status_id === 's1.8'),
    )
    const activeBuyers = users.filter((u) => u.roles.includes('comprador') && u.active)

    if (activeBuyers.length === 0) {
      return toast.error('Nenhum comprador ativo disponível no sistema.')
    }
    if (unassigned.length === 0) {
      return toast.info('Não há solicitações aguardando atribuição.')
    }

    unassigned.forEach((req, idx) => {
      const buyer = activeBuyers[idx % activeBuyers.length]
      updateRequest(req.id, { buyer_id: buyer.id, status_id: 's2' })
    })

    toast.success(`${unassigned.length} solicitações foram atribuídas a compradores.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gestão de Usuários</h3>
        <div className="flex gap-3">
          <Button variant="outline">Novo Usuário</Button>
          <Button onClick={handleAssignBuyers} className="bg-primary hover:bg-primary/90">
            Atribuir Compradores Auto
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel Principal</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{isAdmin || u.is_email_visible ? u.email : '***@***.com'}</TableCell>
                <TableCell className="capitalize">{u.current_role}</TableCell>
                <TableCell>
                  <Badge
                    variant={u.active ? 'default' : 'secondary'}
                    className={u.active ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    {u.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

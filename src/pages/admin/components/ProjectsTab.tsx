import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export function ProjectsTab() {
  const { projects, users } = useAppStore()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Projetos</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Novo Projeto
        </Button>
      </div>
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome do Projeto</TableHead>
              <TableHead>Gerente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => {
              const manager = users.find((u) => u.id === p.manager_id)
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{manager?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.is_active ? 'default' : 'secondary'}
                      className={p.is_active ? 'bg-emerald-500' : ''}
                    >
                      {p.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(p.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

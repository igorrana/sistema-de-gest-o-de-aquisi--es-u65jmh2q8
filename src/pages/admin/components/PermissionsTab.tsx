import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Role, PermissionLevel, PurchaseRequest } from '@/types'
import useAppStore from '@/stores/useAppStore'

export function PermissionsTab() {
  const { permissions, setPermissions } = useAppStore()

  const roles: Role[] = ['admin', 'gerente', 'solicitante', 'comprador']
  const fields: Array<keyof Omit<PurchaseRequest, 'id' | 'created_at' | 'requester_id'>> = [
    'description',
    'type',
    'status_id',
    'buyer_id',
    'request_number',
    'board',
    'order_number',
  ]

  const handleUpdate = (role: Role, field: string, level: PermissionLevel) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: level,
      },
    }))
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[200px] font-bold">Campo de Dados</TableHead>
            {roles.map((r) => (
              <TableHead key={r} className="capitalize">
                {r}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((f) => (
            <TableRow key={f}>
              <TableCell className="font-medium text-slate-700 bg-slate-50/50">{f}</TableCell>
              {roles.map((r) => (
                <TableCell key={r}>
                  <Select
                    value={permissions[r][f]}
                    onValueChange={(v: PermissionLevel) => handleUpdate(r, f, v)}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Access</SelectItem>
                      <SelectItem value="read">Read Only</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

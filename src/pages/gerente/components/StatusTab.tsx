import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { GripVertical } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export function StatusTab() {
  const { statuses, setStatuses } = useAppStore()
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  const handleDragStart = (idx: number) => setDraggedIdx(idx)

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === targetIdx) return

    const newStatuses = [...statuses.sort((a, b) => a.order_index - b.order_index)]
    const [removed] = newStatuses.splice(draggedIdx, 1)
    newStatuses.splice(targetIdx, 0, removed)
    newStatuses.forEach((s, i) => (s.order_index = i + 1))
    setStatuses(newStatuses)
    setDraggedIdx(null)
  }

  const updateStatus = (id: string, updates: any) => {
    setStatuses((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const sortedStatuses = [...statuses].sort((a, b) => a.order_index - b.order_index)

  return (
    <div className="max-w-4xl border rounded-md bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Nome do Status</TableHead>
            <TableHead className="w-32">Cor</TableHead>
            <TableHead className="w-28 text-center">Prazo (dias)</TableHead>
            <TableHead className="w-24 text-center">Ativo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStatuses.map((s, idx) => (
            <TableRow
              key={s.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, idx)}
              className={draggedIdx === idx ? 'opacity-50 bg-slate-100' : ''}
            >
              <TableCell className="cursor-grab active:cursor-grabbing text-slate-400">
                <GripVertical className="h-5 w-5" />
              </TableCell>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateStatus(s.id, { color: e.target.value })}
                    className="p-1 h-8 w-12 cursor-pointer border-slate-200"
                  />
                  <span className="text-xs text-muted-foreground uppercase">{s.color}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Input
                  type="number"
                  min="0"
                  value={s.max_days ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    updateStatus(s.id, { max_days: val === '' ? null : parseInt(val, 10) })
                  }}
                  className="w-20 mx-auto text-center px-2 border-slate-200 focus-visible:ring-1"
                  placeholder="-"
                />
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={s.active}
                  onCheckedChange={(c) => updateStatus(s.id, { active: c })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

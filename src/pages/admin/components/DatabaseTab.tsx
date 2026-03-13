import { ViewRenderer } from '@/components/views/ViewRenderer'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import useAppStore from '@/stores/useAppStore'

export function DatabaseTab({ onRowClick }: { onRowClick: (id: string) => void }) {
  const { requests } = useAppStore()

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-lg font-semibold text-slate-800">Base de Dados Principal</h3>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Exportar Excel
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <ViewRenderer requests={requests} onRowClick={onRowClick} />
      </div>
    </div>
  )
}

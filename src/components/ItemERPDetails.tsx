import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ERP_ITEM_FIELDS } from '@/constants/erp-fields'

export function ItemERPDetails({ item }: { item: any }) {
  const erpData = ERP_ITEM_FIELDS.map((f) => ({
    label: f.label,
    value: item[f.id],
  })).filter((d) => d.value !== undefined && d.value !== null && d.value !== '')

  if (erpData.length === 0) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-primary font-semibold hover:bg-primary/10"
        >
          Ver ERP
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b bg-slate-50 shrink-0">
          <DialogTitle>Detalhes Avançados do Item (ERP)</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {erpData.map((d, i) => (
              <div
                key={i}
                className="flex flex-col space-y-1 bg-white p-3 rounded-md border border-slate-200 shadow-sm"
              >
                <span className="text-xs font-medium text-slate-500 truncate" title={d.label}>
                  {d.label}
                </span>
                <span
                  className="font-semibold text-slate-800 break-words line-clamp-2"
                  title={String(d.value)}
                >
                  {String(d.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

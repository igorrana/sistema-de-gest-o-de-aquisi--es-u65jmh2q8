import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import useAppStore from '@/stores/useAppStore'
import { ItemERPDetails } from '@/components/ItemERPDetails'
import { Loader2, PackageOpen } from 'lucide-react'

export function RequestItemsTab({ requestId }: { requestId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { materials } = useAppStore()

  useEffect(() => {
    supabase
      .from('purchase_request_items')
      .select('*')
      .eq('purchase_request_id', requestId)
      .then(({ data }) => {
        setItems(data || [])
        setLoading(false)
      })
  }, [requestId])

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-sm">Carregando itens...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
        <PackageOpen className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Nenhum item vinculado a esta solicitação.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full p-6">
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-[120px]">Cód. Material</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right w-[80px]">Qtd.</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((i) => {
              const mat = materials.find((m) => m.id === i.material_id)
              return (
                <TableRow key={i.id} className="group">
                  <TableCell className="font-medium text-slate-700">
                    {mat ? mat.custom_code || mat.id : i.material_id}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {mat ? mat.name : 'Item Desconhecido'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{i.quantity}</TableCell>
                  <TableCell className="text-right pr-4">
                    <ItemERPDetails item={i} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  )
}

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAI } from '@/contexts/AIContext'
import { toast } from 'sonner'

export function ProductsTab() {
  const [products, setProducts] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    unit_price: '',
  })
  const { triggerError } = useAI()

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSave = async () => {
    if (!formData.name.trim()) {
      triggerError(
        "It looks like the 'Name' field is empty. This is required to identify the product in the system. Please fill it in to continue.",
      )
      return
    }

    const price = formData.unit_price ? parseFloat(formData.unit_price.replace(',', '.')) : null

    const { error } = await supabase.from('products').insert([
      {
        name: formData.name,
        sku: formData.sku || null,
        description: formData.description || null,
        category: formData.category || null,
        unit_price: isNaN(price as number) ? null : price,
      },
    ])

    if (error) {
      toast.error('Erro ao salvar produto. Verifique se o SKU já existe.')
    } else {
      toast.success('Produto criado com sucesso!')
      setIsOpen(false)
      setFormData({ name: '', sku: '', description: '', category: '', unit_price: '' })
      fetchProducts()
    }
  }

  return (
    <div className="space-y-4 h-[calc(100vh-200px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-lg font-medium">Catálogo de Produtos</h3>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>
      <div className="border rounded-md bg-white flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nome e Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço Unit.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum produto cadastrado.
                  </TableCell>
                </TableRow>
              )}
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.sku || '-'}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-800">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </TableCell>
                  <TableCell>{p.category || '-'}</TableCell>
                  <TableCell>{p.unit_price ? `R$ ${p.unit_price}` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nome *</Label>
              <Input
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">SKU</Label>
              <Input
                className="col-span-3"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Categoria</Label>
              <Input
                className="col-span-3"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Preço</Label>
              <Input
                className="col-span-3"
                placeholder="0.00"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Descrição</Label>
              <Input
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

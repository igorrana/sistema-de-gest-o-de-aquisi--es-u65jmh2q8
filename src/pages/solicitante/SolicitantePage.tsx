import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ViewRenderer } from '@/components/views/ViewRenderer'
import { RequestDrawer } from '@/components/RequestDrawer'
import { NewRequestModal } from './components/NewRequestModal'
import useAppStore from '@/stores/useAppStore'
import useAuthStore from '@/stores/useAuthStore'

export default function SolicitantePage() {
  const [selectedReq, setSelectedReq] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { requests, globalSearch, setGlobalSearch } = useAppStore()
  const { currentUser } = useAuthStore()

  // RLS Simulation: own requests + requests without request_number
  const myRequests = requests.filter((r) => r.requester_id === currentUser?.id || !r.request_number)

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">Minhas Solicitações</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-8 w-64 bg-white shadow-sm"
            />
          </div>
          <Button onClick={() => setModalOpen(true)} className="shadow-sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Solicitação
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ViewRenderer requests={myRequests} onRowClick={setSelectedReq} />
      </div>

      <RequestDrawer requestId={selectedReq} onClose={() => setSelectedReq(null)} />
      <NewRequestModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}

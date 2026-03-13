import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ViewRenderer } from '@/components/views/ViewRenderer'
import { RequestDrawer } from '@/components/RequestDrawer'
import { ClaimRequestModal } from './components/ClaimRequestModal'
import useAppStore from '@/stores/useAppStore'
import useAuthStore from '@/stores/useAuthStore'

export default function CompradorPage() {
  const [selectedReq, setSelectedReq] = useState<string | null>(null)
  const [claimOpen, setClaimOpen] = useState(false)
  const { requests } = useAppStore()
  const { currentUser } = useAuthStore()

  // RLS Simulation: Assigned + unassigned waiting for buyer (s2)
  const myAssigned = requests.filter((r) => r.buyer_id === currentUser?.id)
  const unassigned = requests.filter((r) => !r.buyer_id && r.status_id === 's2')

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">Workspace do Comprador</h1>
        <Button
          onClick={() => setClaimOpen(true)}
          className="shadow-sm bg-primary hover:bg-primary/90"
        >
          <Search className="mr-2 h-4 w-4" /> Resgatar Solicitação
        </Button>
      </div>

      <Tabs defaultValue="mine" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit mb-4 shrink-0 bg-white border shadow-sm">
          <TabsTrigger
            value="mine"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Minhas Atribuições ({myAssigned.length})
          </TabsTrigger>
          <TabsTrigger
            value="pool"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Fila sem Comprador ({unassigned.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mine" className="flex-1 mt-0 m-0 min-h-0">
          <ViewRenderer requests={myAssigned} onRowClick={setSelectedReq} />
        </TabsContent>
        <TabsContent value="pool" className="flex-1 mt-0 m-0 min-h-0">
          <ViewRenderer requests={unassigned} onRowClick={setSelectedReq} />
        </TabsContent>
      </Tabs>

      <RequestDrawer requestId={selectedReq} onClose={() => setSelectedReq(null)} />
      <ClaimRequestModal open={claimOpen} onOpenChange={setClaimOpen} />
    </div>
  )
}

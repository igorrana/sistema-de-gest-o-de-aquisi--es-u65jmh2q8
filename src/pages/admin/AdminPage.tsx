import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DatabaseTab } from './components/DatabaseTab'
import { ImportTab } from './components/ImportTab'
import { PermissionsTab } from './components/PermissionsTab'
import { RequestDrawer } from '@/components/RequestDrawer'

export default function AdminPage() {
  const [selectedReq, setSelectedReq] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 shrink-0">Painel do Administrador</h1>
      <Tabs defaultValue="db" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit mb-4 shrink-0">
          <TabsTrigger value="db">Base de Dados</TabsTrigger>
          <TabsTrigger value="import">Importação</TabsTrigger>
          <TabsTrigger value="perms">Permissões</TabsTrigger>
        </TabsList>
        <TabsContent value="db" className="flex-1 mt-0 m-0 min-h-0">
          <DatabaseTab onRowClick={setSelectedReq} />
        </TabsContent>
        <TabsContent value="import" className="mt-0">
          <ImportTab />
        </TabsContent>
        <TabsContent value="perms" className="mt-0">
          <PermissionsTab />
        </TabsContent>
      </Tabs>
      <RequestDrawer requestId={selectedReq} onClose={() => setSelectedReq(null)} />
    </div>
  )
}

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DatabaseTab } from './components/DatabaseTab'
import { ImportTab } from './components/ImportTab'
import { PermissionsTab } from './components/PermissionsTab'
import { ProjectsTab } from './components/ProjectsTab'
import { RequestTypesTab } from './components/RequestTypesTab'
import { UsersRolesTab } from './components/UsersRolesTab'
import { MaterialsTab } from './components/MaterialsTab'
import { ProductsTab } from './components/ProductsTab'
import { SettingsTab } from './components/SettingsTab'
import { RequestDrawer } from '@/components/RequestDrawer'

export default function AdminPage() {
  const [selectedReq, setSelectedReq] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 shrink-0">Painel do Administrador</h1>
      <Tabs defaultValue="db" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit mb-4 shrink-0 bg-white border shadow-sm flex-wrap h-auto py-1">
          <TabsTrigger value="db">Base de Dados</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="reqTypes">Tipos de Solicitação</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="users">Usuários e Perfis</TabsTrigger>
          <TabsTrigger value="perms">Permissões</TabsTrigger>
          <TabsTrigger value="import">Importação</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        <TabsContent value="db" className="flex-1 mt-0 m-0 min-h-0">
          <DatabaseTab onRowClick={setSelectedReq} />
        </TabsContent>
        <TabsContent value="projects" className="mt-0">
          <ProjectsTab />
        </TabsContent>
        <TabsContent value="reqTypes" className="mt-0">
          <RequestTypesTab />
        </TabsContent>
        <TabsContent value="materials" className="mt-0">
          <MaterialsTab />
        </TabsContent>
        <TabsContent value="products" className="mt-0">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="users" className="mt-0">
          <UsersRolesTab />
        </TabsContent>
        <TabsContent value="perms" className="mt-0">
          <PermissionsTab />
        </TabsContent>
        <TabsContent value="import" className="mt-0">
          <ImportTab />
        </TabsContent>
        <TabsContent value="settings" className="mt-0">
          <SettingsTab />
        </TabsContent>
      </Tabs>
      <RequestDrawer requestId={selectedReq} onClose={() => setSelectedReq(null)} />
    </div>
  )
}

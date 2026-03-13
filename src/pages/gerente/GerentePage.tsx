import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardTab } from './components/DashboardTab'
import { UsersTab } from './components/UsersTab'
import { StatusTab } from './components/StatusTab'

export default function GerentePage() {
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 shrink-0">Gestão Estratégica</h1>
      <Tabs defaultValue="dash" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit mb-4 shrink-0 bg-white border shadow-sm">
          <TabsTrigger
            value="dash"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="status"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Configurar Status
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dash" className="mt-0">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="users" className="mt-0">
          <UsersTab />
        </TabsContent>
        <TabsContent value="status" className="mt-0">
          <StatusTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

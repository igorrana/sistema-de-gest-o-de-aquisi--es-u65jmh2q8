import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from 'recharts'
import useAppStore from '@/stores/useAppStore'

export function DashboardTab() {
  const { requests, statuses } = useAppStore()

  const stats = useMemo(() => {
    return statuses
      .filter((s) => s.active)
      .map((s) => ({
        name: s.name,
        color: s.color,
        count: requests.filter((r) => r.status_id === s.id).length,
      }))
  }, [requests, statuses])

  const totalOpen = requests.filter((r) => r.status_id !== 's6' && r.status_id !== 's7').length
  const pendingApproval = requests.filter((r) => r.status_id === 's1.5').length
  const unassigned = requests.filter((r) => !r.buyer_id && r.status_id === 's2').length
  const delivered = requests.filter((r) => r.status_id === 's6').length

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Abertas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-slate-800">{totalOpen}</CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Aguardando Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-purple-600">
            {pendingApproval}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Aguardando Comprador
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-amber-500">{unassigned}</CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Entregues
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-emerald-500">{delivered}</CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ChartContainer config={{ count: { label: 'Solicitações' } }} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    dy={10}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: '#F1F5F9' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

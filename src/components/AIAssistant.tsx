import { Bot, X, Maximize2, Minimize2, Send, BarChart2, FileText } from 'lucide-react'
import { useAI } from '@/contexts/AIContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function AIAssistant() {
  const { isOpen, setIsOpen, messages, sendMessage } = useAI()
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [messages, isOpen])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 p-0 z-50 flex items-center justify-center animate-bounce"
      >
        <Bot className="h-7 w-7 text-white" />
      </Button>
    )
  }

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input, location.pathname)
    setInput('')
  }

  const chartConfig = {
    value: { label: 'Valor', color: 'hsl(var(--primary))' },
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-[600px] h-[80vh]' : 'w-[380px] h-[500px]'}`}
    >
      <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <div>
            <h3 className="font-bold text-sm leading-none">Cody - IA Assistente</h3>
            <p className="text-[11px] opacity-80 mt-0.5">Online e pronto para ajudar</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-indigo-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-indigo-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-slate-50" ref={scrollRef}>
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 rounded-bl-none text-slate-700'}`}
              >
                {m.content}
              </div>

              {m.chart && (
                <div className="mt-2 w-[100%] max-w-full bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-2 self-stretch">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <BarChart2 className="h-4 w-4 text-indigo-600" /> {m.chart.title}
                  </div>
                  <div className="h-[200px] w-full">
                    <ChartContainer config={chartConfig}>
                      <BarChart data={m.chart.data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 10 }}
                          width={30}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>
              )}

              {m.report && (
                <div className="mt-2 w-[100%] max-w-full bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-2 self-stretch overflow-hidden">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <FileText className="h-4 w-4 text-indigo-600" /> {m.report.title}
                  </div>
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          {m.report.columns.map((c: string, i: number) => (
                            <TableHead key={i} className="text-xs h-8 whitespace-nowrap">
                              {c}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {m.report.data.map((row: string[], i: number) => (
                          <TableRow key={i}>
                            {row.map((cell, j) => (
                              <TableCell key={j} className="text-xs py-2 whitespace-nowrap">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 bg-white border-t shrink-0 flex items-center gap-2 rounded-b-2xl">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre relatórios, dashboards ou erros..."
          className="flex-1 rounded-full bg-slate-50 border-slate-200 h-10"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          size="icon"
          className="rounded-full h-10 w-10 shrink-0 bg-indigo-600 hover:bg-indigo-700"
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

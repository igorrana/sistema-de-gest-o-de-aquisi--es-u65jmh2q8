import React, { createContext, useContext, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'

export type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
  chart?: { type: string; title: string; data: any[] }
  report?: { title: string; columns: string[]; data: any[][] }
}

interface AIContextType {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  messages: Message[]
  addMessage: (m: Omit<Message, 'id'>) => void
  triggerError: (msg: string) => void
  sendMessage: (text: string, path: string) => Promise<void>
}

export const AIContext = createContext<AIContextType | null>(null)

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Olá! Sou o Cody. Como posso ajudar com os processos e dashboards hoje?',
    },
  ])

  const addMessage = (m: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, { ...m, id: Math.random().toString() }])
  }

  const triggerError = (msg: string) => {
    setIsOpen(true)
    addMessage({ role: 'ai', content: msg })
  }

  const sendMessage = async (text: string, path: string) => {
    addMessage({ role: 'user', content: text })
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { message: text, path, pageContext: 'Sistema de Aquisições' },
      })
      if (error) throw error
      if (data) {
        addMessage({
          role: 'ai',
          content: data.reply || '',
          chart: data.chart,
          report: data.report,
        })
      }
    } catch (e) {
      addMessage({ role: 'ai', content: 'Desculpe, ocorreu um erro ao comunicar com a IA.' })
    }
  }

  return (
    <AIContext.Provider
      value={{ isOpen, setIsOpen, messages, addMessage, triggerError, sendMessage }}
    >
      {children}
    </AIContext.Provider>
  )
}

export const useAI = () => {
  const ctx = useContext(AIContext)
  if (!ctx) throw new Error('useAI must be used within AIProvider')
  return ctx
}

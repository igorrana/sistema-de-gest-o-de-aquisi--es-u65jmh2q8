import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, path, pageContext } = await req.json()
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    let aiResponse = ""
    let chart = undefined
    let report = undefined

    const lowerMsg = message.toLowerCase()

    if (lowerMsg.includes('dashboard') || lowerMsg.includes('priority') || lowerMsg.includes('prioridade')) {
      aiResponse = "Aqui está o dashboard de solicitações por prioridade, conforme solicitado:"
      chart = {
        type: "bar",
        title: "Solicitações por Prioridade",
        data: [
          { name: "P0 - Crítica", value: 12 },
          { name: "P1 - Alta", value: 25 },
          { name: "P2 - Normal", value: 40 }
        ]
      }
    } else if (lowerMsg.includes('report') || lowerMsg.includes('relatório') || lowerMsg.includes('electronics') || lowerMsg.includes('eletrônicos')) {
      aiResponse = "Gerei um relatório com todos os produtos da categoria Eletrônicos:"
      report = {
        title: "Produtos - Categoria: Eletrônicos",
        columns: ["Nome", "SKU", "Categoria", "Preço"],
        data: [
          ["Smartphone Advanced", "ELEC-1001", "Eletrônicos", "R$ 3.500,00"],
          ["Notebook Pro 15", "ELEC-1002", "Eletrônicos", "R$ 8.200,00"],
          ["Monitor 4K", "ELEC-1003", "Eletrônicos", "R$ 2.100,00"]
        ]
      }
    } else if (lowerMsg.includes('erro') || lowerMsg.includes('duplicado') || lowerMsg.includes('salvar') || lowerMsg.includes('problema')) {
      aiResponse = `🚨 **Solução de Erro de Validação**:\nSe o sistema encontrou um erro de **ID duplicado** (ex: \`REQ-001\` já foi utilizado), faça o seguinte:\n\n1. Feche o aviso de erro na tela.\n2. Altere o campo "ID da Solicitação" para uma nova numeração (ex: \`REQ-002\`).\n3. Verifique se os campos obrigatórios (*) estão todos preenchidos.\n4. Clique novamente em "Salvar e Enviar".\n\nIsso garantirá que a nova requisição seja única no sistema.`
    } else if (lowerMsg.includes('mapear') || lowerMsg.includes('importa') || lowerMsg.includes('planilha') || lowerMsg.includes('coluna')) {
      aiResponse = `💡 **Guia de Importação de Planilhas**:\nPara garantir que o agrupamento de itens funcione:\n\n- **ID da Solicitação**: Mapeie essa coluna! Ela deve ter o mesmo valor para itens da mesma solicitação.\n- **Cód. Material**: Obrigatório. Sem ele, o item não é vinculado.\n- Colunas que o sistema não usa devem ficar como **Não mapear**.`
    } else {
      aiResponse = `🤖 Olá! Sou o Cody, seu Assistente de IA. Notei que você está acessando a área: **${pageContext || 'Sistema'}**.\n\nEu posso ajudar você com:\n- Dicas analíticas e resumos das requisições.\n- Gerar um **dashboard** (ex: "Show me a dashboard of requests by priority").\n- Gerar um **relatório** (ex: "Create a report of all products in the Electronics category").\n\nComo posso ajudar hoje?`
    }

    return new Response(JSON.stringify({ reply: aiResponse, chart, report }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

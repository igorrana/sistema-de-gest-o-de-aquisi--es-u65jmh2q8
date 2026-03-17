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

    if (apiKey) {
      const authHeader = req.headers.get('Authorization')
      let userReqs = []
      
      if (authHeader) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          { global: { headers: { Authorization: authHeader } } }
        )
        // Respecting RLS by using the auth token of the user
        const { data } = await supabase.from('purchase_requests').select('request_number, status_id, priority, type').limit(20)
        userReqs = data || []
      }

      const systemPrompt = `Você é o "Cody", um assistente virtual analítico especializado no Sistema de Gestão de Aquisições.
O usuário está navegando na página: ${path}
Contexto atual: ${pageContext}
Dados de requisições recentes (respeitando privacidade RLS): ${JSON.stringify(userReqs)}

Seja prestativo, educado e direto. 
- Para erros de formulário, indique claramente o problema e o passo a passo da solução.
- Para importação, instrua o mapeamento correto.
- Para relatórios, use os dados passados e apresente de forma analítica.
Formate palavras ou partes importantes com **negrito** e use quebras de linha para listas e tópicos.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      })

      const result = await response.json()
      if (result.choices && result.choices.length > 0) {
        aiResponse = result.choices[0].message.content
      } else {
        throw new Error('Falha na resposta do LLM')
      }
    } else {
      // Mock Fallback when API Key is not set, simulating expected behavior
      const lowerMsg = message.toLowerCase()
      if (lowerMsg.includes('resumo') || lowerMsg.includes('relatório') || lowerMsg.includes('status')) {
         aiResponse = `📊 **Análise de Requisições**:\nNotei que existem solicitações aguardando andamento no sistema.\n\nSugiro focar nas solicitações **Aguardando Comprador** (S2) que possuem **Prioridade P0 - Crítica** para evitar grandes atrasos.\nAs aprovações gerenciais estão ocorrendo dentro da média, mas fique atento aos prazos de entrega acordados.`
      } else if (lowerMsg.includes('erro') || lowerMsg.includes('duplicado') || lowerMsg.includes('salvar') || lowerMsg.includes('problema')) {
         aiResponse = `🚨 **Solução de Erro de Validação**:\nSe o sistema encontrou um erro de **ID duplicado** (ex: \`REQ-001\` já foi utilizado), faça o seguinte:\n\n1. Feche o aviso de erro na tela.\n2. Altere o campo "ID da Solicitação" para uma nova numeração (ex: \`REQ-002\`).\n3. Verifique se os campos obrigatórios (*) estão todos preenchidos.\n4. Clique novamente em "Salvar e Enviar".\n\nIsso garantirá que a nova requisição seja única no sistema.`
      } else if (lowerMsg.includes('mapear') || lowerMsg.includes('importa') || lowerMsg.includes('planilha') || lowerMsg.includes('coluna')) {
         aiResponse = `💡 **Guia de Importação de Planilhas**:\nPara garantir que o agrupamento de itens funcione:\n\n- **ID da Solicitação**: Mapeie essa coluna! Ela deve ter o mesmo valor para itens da mesma solicitação (ex: duas linhas com \`REQ-001\` se tornarão uma requisição com dois itens).\n- **Cód. Material**: Obrigatório. Sem ele, o item não é vinculado.\n- Colunas que o sistema não usa (ex: observações locais) devem ficar como **Não mapear**.\n\nSe o sistema apontar erros de IDs que já existem, remova a requisição do arquivo ou altere o ID na planilha antes de confirmar.`
      } else {
         aiResponse = `🤖 Olá! Sou o Cody, seu Assistente de IA. Notei que você está acessando a área: **${pageContext}**.\n\nEu posso ajudar você com:\n- Dicas analíticas e resumos das requisições.\n- Instruções passo a passo para corrigir validações.\n- Mapeamento de colunas em importações.\n\nEscolha uma das ações rápidas abaixo ou escreva sua dúvida!`
      }
    }

    return new Response(JSON.stringify({ reply: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

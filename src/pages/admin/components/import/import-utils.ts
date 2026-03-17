import { supabase } from '@/lib/supabase/client'

export async function processImport(groupsToImport: any[]) {
  let importedCount = 0
  for (const g of groupsToImport) {
    const itemsToImport = g.items.filter((i: any) => i.accepted)
    if (itemsToImport.length === 0) continue

    const payload: any = {
      request_number: g.request_number,
      description: g.description,
      type: g.type || 'Material',
      priority: g.priority || 'P2',
      status_id: g.status_id || 's1',
    }
    if (g.project_id) payload.project_id = g.project_id
    if (g.request_type_id) payload.request_type_id = g.request_type_id
    if (g.need_date) payload.need_date = g.need_date
    if (g.delivery_date) payload.delivery_date = g.delivery_date
    if (g.requester_id) payload.requester_id = g.requester_id
    if (g.buyer_id) payload.buyer_id = g.buyer_id
    if (g.board) payload.board = g.board
    if (g.order_number) payload.order_number = g.order_number

    const { data: reqData, error: reqError } = await supabase
      .from('purchase_requests')
      .insert(payload)
      .select('id')
      .single()

    if (reqError || !reqData) {
      console.error('Error inserting request:', reqError)
      continue
    }

    const itemsPayload = itemsToImport.map((i: any) => ({
      purchase_request_id: reqData.id,
      material_id: i.material_id,
      quantity: i.quantity,
    }))

    if (itemsPayload.length > 0) {
      const { error: itemsError } = await supabase
        .from('purchase_request_items')
        .insert(itemsPayload)
      if (itemsError) console.error('Error inserting items:', itemsError)
    }

    importedCount++
  }
  return importedCount
}

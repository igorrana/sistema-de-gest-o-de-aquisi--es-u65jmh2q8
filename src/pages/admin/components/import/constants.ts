export const SYSTEM_FIELDS = [
  { id: 'request_number', label: 'ID da Solicitação', required: true },
  { id: 'description', label: 'Descrição', required: true },
  { id: 'material_id', label: 'Cód. Material (Item)', required: true },
  { id: 'quantity', label: 'Quantidade (Item)', required: true },
  { id: 'type', label: 'Tipo (Material/Serviço)', required: false },
  { id: 'project_id', label: 'ID do Projeto', required: false },
  { id: 'request_type_id', label: 'ID do Tipo de Solicitação', required: false },
  { id: 'priority', label: 'Prioridade (ex: P0, P1, P2)', required: false },
  { id: 'need_date', label: 'Data de Necessidade', required: false },
  { id: 'delivery_date', label: 'Data de Entrega', required: false },
  { id: 'status_id', label: 'ID do Status', required: false },
  { id: 'requester_id', label: 'ID do Solicitante', required: false },
  { id: 'buyer_id', label: 'ID do Comprador', required: false },
  { id: 'board', label: 'Quadro (Board)', required: false },
  { id: 'order_number', label: 'Número do Pedido', required: false },
]

export const REQUEST_FIELDS = SYSTEM_FIELDS

export const PRODUCT_FIELDS = [
  { id: 'name', label: 'Nome do Produto', required: true },
  { id: 'sku', label: 'SKU (Código Único)', required: false },
  { id: 'description', label: 'Descrição', required: false },
  { id: 'category', label: 'Categoria', required: false },
  { id: 'unit_price', label: 'Preço Unitário', required: false },
]

export type Role = 'admin' | 'gerente' | 'solicitante' | 'comprador'

export interface User {
  id: string
  name: string
  email: string
  current_role: Role
  roles: Role[]
  active: boolean
  view_preference: 'table' | 'kanban'
  is_email_visible: boolean
}

export interface Project {
  id: string
  name: string
  manager_id: string
  is_active: boolean
  created_at: string
}

export interface RequestType {
  id: string
  name: string
  description: string
  default_buyer_id: string | null
  is_active: boolean
  created_at: string
}

export interface Material {
  id: string
  custom_code: string
  system_code: string
  name: string
  description: string
  type: 'Material' | 'Serviço'
  unit: string
  ncm: string
  fab_exclusivo: 'SIM' | 'NÃO'
  obra: string
  local_de_aplicacao: string
  created_by: string
  created_at: string
}

export interface Status {
  id: string
  name: string
  color: string
  order_index: number
  active: boolean
  max_days?: number | null
}

export interface PurchaseRequestItem {
  id: string
  material_id: string
  quantity: number
  // ERP Fields
  filial?: string
  numero_sc?: string
  item_sc?: string
  produto_id?: string
  descricao?: string
  tipo?: string
  segunda_unid?: string
  unid_med?: string
  quantidade?: number
  qtd_2a?: number
  data_necessidade?: string
  armazem?: string
  localizacao?: string
  observacao?: string
  dt_emissao?: string
  centro_custo?: string
  ordem_producao?: string
  conta_contabil?: string
  item_contabil?: string
  num_cotacao?: string
  solicitante?: string
  fornecedor?: string
  quant_entregue?: number
  ok_status?: string
  transmissao?: string
  unid_1?: string
  loja_fornecedor?: string
  classificacao?: string
  fabricante?: string
  num_pedido?: string
  num_solic?: string
  nome_solicitante?: string
  grupo_compras?: string
  item_pedido?: string
  cod_cliente?: string
  identificador?: string
  num_os?: string
  tipo_operacao?: string
  cod_unidade?: string
  qtd_seq?: string
  seq_mrp?: string
  rotina?: string
  ger_proc?: string
  grupo?: string
  elim_res?: string
  tipo_entrada?: string
  qtd_orig?: string
  cod_prod?: string
  filial_entrega?: string
  preco_estimado?: number
  cond_pagto?: string
  cod_oper?: string
  preco_unitario?: number
  valor_total?: number
  especie?: string
  flag_alt?: string
  gera_cp?: string
  moeda?: string
  cod_local?: string
  item_grade?: string
  grade?: string
  reemissao?: string
  nome?: string
  tipo_solic?: string
  modalidade?: string
  tipo_mov?: string
  usr_mutal?: string
  num_orcamento?: string
  ctr_custo?: string
  cod_estoque?: string
  nr_projeto?: string
  rateio?: string
  programada?: string
  acc?: string
  sol_alt?: string
  item_alt?: string
  rev_estoque?: string
  item_origem?: string
  centralizacao?: string
  atualizacao?: string
  filial_origem?: string
  sc_origem?: string
  id_aps?: string
  prod_res?: string
  data_aprov?: string
  drp_necess?: string
  nr_bordero?: string
  aprovador?: string
  comprador?: string
  tipo_cont?: string
  ped_venda?: string
  usr_canc?: string
  dt_canc?: string
  prod_interno?: string
  vlr_atu?: number
  seq_sdc?: string
  dt_fim_prod?: string
  dt_ini_prod?: string
  hr_fim?: string
  hr_ini?: string
  status?: string
  prefixo?: string
  contr_loc?: string
  grupo_item?: string
  [key: string]: any
}

export interface PurchaseRequest {
  id: string
  request_number: string | null
  description: string
  type: 'Material' | 'Serviço'
  project_id: string
  request_type_id: string
  priority: 'P0' | 'P1' | 'P2'
  need_date: string | null
  delivery_date: string | null
  status_changed_at: string | null
  is_completed: boolean
  is_delayed: boolean
  status_id: string
  requester_id: string
  buyer_id: string | null
  board: string | null
  order_number: string | null
  created_at: string
  items?: PurchaseRequestItem[]
}

export interface FieldChangeLog {
  id: string
  request_id: string
  field: string
  old_value: string | null
  new_value: string | null
  changed_by: string
  changed_at: string
}

export type PermissionLevel = 'none' | 'read' | 'edit'

export type PermissionsMap = Record<
  Role,
  Record<keyof Omit<PurchaseRequest, 'id' | 'created_at' | 'requester_id'>, PermissionLevel>
>

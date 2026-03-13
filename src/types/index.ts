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
}

export interface PurchaseRequestItem {
  id: string
  material_id: string
  quantity: number
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

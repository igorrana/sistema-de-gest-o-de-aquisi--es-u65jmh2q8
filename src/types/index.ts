export type Role = 'admin' | 'gerente' | 'solicitante' | 'comprador'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  view_preference: 'table' | 'kanban'
}

export interface Status {
  id: string
  name: string
  color: string
  order: number
  active: boolean
}

export interface PurchaseRequest {
  id: string
  request_number: string | null
  description: string
  type: 'Material' | 'Serviço'
  status_id: string
  requester_id: string
  buyer_id: string | null
  board: string | null
  order_number: string | null
  created_at: string
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

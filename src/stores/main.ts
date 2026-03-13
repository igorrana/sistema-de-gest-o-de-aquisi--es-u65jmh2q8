import React, { createContext, useState, useCallback } from 'react'
import {
  User,
  Status,
  PurchaseRequest,
  PermissionsMap,
  FieldChangeLog,
  Project,
  RequestType,
  Material,
  Role,
} from '../types'
import {
  MOCK_USERS,
  MOCK_STATUSES,
  MOCK_REQUESTS,
  MOCK_PERMISSIONS,
  MOCK_PROJECTS,
  MOCK_REQUEST_TYPES,
  MOCK_MATERIALS,
} from '../data/mock'

export interface AuthContextType {
  currentUser: User | null
  login: (email: string, pass: string) => User | null
  logout: () => void
  updateViewPreference: (pref: 'table' | 'kanban') => void
  switchRole: (role: Role) => void
}

export interface AppContextType {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  statuses: Status[]
  setStatuses: React.Dispatch<React.SetStateAction<Status[]>>
  requests: PurchaseRequest[]
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  requestTypes: RequestType[]
  setRequestTypes: React.Dispatch<React.SetStateAction<RequestType[]>>
  materials: Material[]
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>
  permissions: PermissionsMap
  setPermissions: React.Dispatch<React.SetStateAction<PermissionsMap>>
  logs: FieldChangeLog[]
  globalSearch: string
  setGlobalSearch: (s: string) => void
  updateRequest: (id: string, data: Partial<PurchaseRequest>) => void
  addRequest: (data: Partial<PurchaseRequest>) => void
  addMaterial: (data: Partial<Material>) => Material
}

export const AuthContext = createContext<AuthContextType | null>(null)
export const AppContext = createContext<AppContextType | null>(null)

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [statuses, setStatuses] = useState<Status[]>(MOCK_STATUSES)
  const [requests, setRequests] = useState<PurchaseRequest[]>(MOCK_REQUESTS)
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [requestTypes, setRequestTypes] = useState<RequestType[]>(MOCK_REQUEST_TYPES)
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS)
  const [permissions, setPermissions] = useState<PermissionsMap>(MOCK_PERMISSIONS)
  const [logs, setLogs] = useState<FieldChangeLog[]>([])
  const [globalSearch, setGlobalSearch] = useState('')

  const login = useCallback(
    (email: string, pass: string) => {
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.active)
      if (user && pass) {
        setCurrentUser(user)
        return user
      }
      return null
    },
    [users],
  )

  const logout = useCallback(() => setCurrentUser(null), [])

  const updateViewPreference = useCallback(
    (pref: 'table' | 'kanban') => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, view_preference: pref })
        setUsers((prev) =>
          prev.map((u) => (u.id === currentUser.id ? { ...u, view_preference: pref } : u)),
        )
      }
    },
    [currentUser],
  )

  const switchRole = useCallback(
    (role: Role) => {
      if (currentUser && currentUser.roles.includes(role)) {
        setCurrentUser({ ...currentUser, current_role: role })
        setUsers((prev) =>
          prev.map((u) => (u.id === currentUser.id ? { ...u, current_role: role } : u)),
        )
      }
    },
    [currentUser],
  )

  const updateRequest = useCallback(
    (id: string, data: Partial<PurchaseRequest>) => {
      setRequests((prev) => {
        const existing = prev.find((r) => r.id === id)
        if (!existing) return prev
        const updatedData = { ...data }
        if (updatedData.buyer_id && updatedData.buyer_id !== existing.buyer_id) {
          if (!updatedData.status_id && existing.status_id === 's1.8') updatedData.status_id = 's2'
        }
        if (
          'order_number' in updatedData &&
          updatedData.order_number &&
          String(updatedData.order_number).trim() !== '' &&
          updatedData.order_number !== existing.order_number
        ) {
          if (existing.status_id !== 's4' && updatedData.status_id !== 's4')
            updatedData.status_id = 's4'
        }
        if (updatedData.status_id && updatedData.status_id !== existing.status_id) {
          updatedData.status_changed_at = new Date().toISOString()
        }
        const newLogs: FieldChangeLog[] = []
        Object.keys(updatedData).forEach((key) => {
          const k = key as keyof PurchaseRequest
          if (existing[k] !== updatedData[k]) {
            newLogs.push({
              id: Math.random().toString(36).substring(2, 9),
              request_id: id,
              field: key,
              old_value: String(existing[k] || ''),
              new_value: String(updatedData[k] || ''),
              changed_by: currentUser?.name || 'Sistema',
              changed_at: new Date().toISOString(),
            })
          }
        })
        if (newLogs.length > 0) setLogs((l) => [...newLogs, ...l])
        return prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
      })
    },
    [currentUser],
  )

  const addRequest = useCallback((data: Partial<PurchaseRequest>) => {
    const newReq: PurchaseRequest = {
      id: Math.random().toString(36).substring(2, 9),
      request_number: null,
      description: data.description || '',
      type: data.type || 'Material',
      project_id: data.project_id || '',
      request_type_id: data.request_type_id || '',
      priority: data.priority || 'P2',
      need_date: data.need_date || null,
      delivery_date: null,
      status_changed_at: new Date().toISOString(),
      is_completed: false,
      is_delayed: false,
      status_id: data.status_id || 's1',
      requester_id: data.requester_id || '',
      buyer_id: data.buyer_id || null,
      board: null,
      order_number: null,
      created_at: new Date().toISOString(),
      ...data,
    }
    setRequests((prev) => [...prev, newReq])
  }, [])

  const addMaterial = useCallback(
    (data: Partial<Material>) => {
      const newMat: Material = {
        id: Math.random().toString(36).substring(2, 9),
        custom_code: data.custom_code || '',
        system_code: data.system_code || '',
        name: data.name || '',
        description: data.description || '',
        type: data.type || 'Material',
        unit: data.unit || 'un',
        ncm: data.ncm || '',
        fab_exclusivo: data.fab_exclusivo || 'NÃO',
        obra: data.obra || 'Geral',
        local_de_aplicacao: data.local_de_aplicacao || 'Geral',
        created_by: currentUser?.id || 'Sistema',
        created_at: new Date().toISOString(),
        ...data,
      }
      setMaterials((prev) => [...prev, newMat])
      return newMat
    },
    [currentUser],
  )

  const authValue = React.useMemo(
    () => ({ currentUser, login, logout, updateViewPreference, switchRole }),
    [currentUser, login, logout, updateViewPreference, switchRole],
  )
  const appValue = React.useMemo(
    () => ({
      users,
      setUsers,
      statuses,
      setStatuses,
      requests,
      projects,
      setProjects,
      requestTypes,
      setRequestTypes,
      materials,
      setMaterials,
      permissions,
      setPermissions,
      logs,
      globalSearch,
      setGlobalSearch,
      updateRequest,
      addRequest,
      addMaterial,
    }),
    [
      users,
      statuses,
      requests,
      projects,
      requestTypes,
      materials,
      permissions,
      logs,
      globalSearch,
      updateRequest,
      addRequest,
      addMaterial,
    ],
  )

  return React.createElement(
    AuthContext.Provider,
    { value: authValue },
    React.createElement(AppContext.Provider, { value: appValue }, children),
  )
}

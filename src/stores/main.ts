import React, { createContext, useState, useCallback } from 'react'
import { User, Status, PurchaseRequest, PermissionsMap, FieldChangeLog } from '../types'
import { MOCK_USERS, MOCK_STATUSES, MOCK_REQUESTS, MOCK_PERMISSIONS } from '../data/mock'

export interface AuthContextType {
  currentUser: User | null
  login: (email: string, pass: string) => User | null
  logout: () => void
  updateViewPreference: (pref: 'table' | 'kanban') => void
}

export interface AppContextType {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  statuses: Status[]
  setStatuses: React.Dispatch<React.SetStateAction<Status[]>>
  requests: PurchaseRequest[]
  permissions: PermissionsMap
  setPermissions: React.Dispatch<React.SetStateAction<PermissionsMap>>
  logs: FieldChangeLog[]
  globalSearch: string
  setGlobalSearch: (s: string) => void
  updateRequest: (id: string, data: Partial<PurchaseRequest>) => void
  addRequest: (data: Omit<PurchaseRequest, 'id' | 'created_at' | 'request_number'>) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
export const AppContext = createContext<AppContextType | null>(null)

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [statuses, setStatuses] = useState<Status[]>(MOCK_STATUSES)
  const [requests, setRequests] = useState<PurchaseRequest[]>(MOCK_REQUESTS)
  const [permissions, setPermissions] = useState<PermissionsMap>(MOCK_PERMISSIONS)
  const [logs, setLogs] = useState<FieldChangeLog[]>([])
  const [globalSearch, setGlobalSearch] = useState('')

  const login = useCallback(
    (email: string, pass: string) => {
      const user = users.find((u) => u.email === email && u.active)
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

  const updateRequest = useCallback(
    (id: string, data: Partial<PurchaseRequest>) => {
      setRequests((prev) => {
        const existing = prev.find((r) => r.id === id)
        if (!existing) return prev

        const updatedData = { ...data }

        if (
          'order_number' in updatedData &&
          updatedData.order_number &&
          String(updatedData.order_number).trim() !== '' &&
          updatedData.order_number !== existing.order_number
        ) {
          if (existing.status_id !== 's4' && updatedData.status_id !== 's4') {
            updatedData.status_id = 's4'
          }
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
        if (newLogs.length > 0) {
          setLogs((l) => [...newLogs, ...l])
        }
        return prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r))
      })
    },
    [currentUser],
  )

  const addRequest = useCallback(
    (data: Omit<PurchaseRequest, 'id' | 'created_at' | 'request_number'>) => {
      const newReq: PurchaseRequest = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        request_number: null,
        created_at: new Date().toISOString(),
      }
      setRequests((prev) => [...prev, newReq])
    },
    [],
  )

  const authValue = React.useMemo(
    () => ({ currentUser, login, logout, updateViewPreference }),
    [currentUser, login, logout, updateViewPreference],
  )
  const appValue = React.useMemo(
    () => ({
      users,
      setUsers,
      statuses,
      setStatuses,
      requests,
      permissions,
      setPermissions,
      logs,
      globalSearch,
      setGlobalSearch,
      updateRequest,
      addRequest,
    }),
    [users, statuses, requests, permissions, logs, globalSearch, updateRequest, addRequest],
  )

  return React.createElement(
    AuthContext.Provider,
    { value: authValue },
    React.createElement(AppContext.Provider, { value: appValue }, children),
  )
}

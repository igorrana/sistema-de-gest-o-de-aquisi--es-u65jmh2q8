import { useContext } from 'react'
import { AuthContext } from './main'

export default function useAuthStore() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthStore must be used within RootProvider')
  return context
}

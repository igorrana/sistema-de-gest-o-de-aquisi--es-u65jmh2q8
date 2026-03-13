import { useContext } from 'react'
import { AppContext } from './main'

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within RootProvider')
  return context
}

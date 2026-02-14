'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, isSupabaseConfigured, type User } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemoMode = !isSupabaseConfigured

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode: check localStorage
      checkLocalStorageUser()
    } else {
      // Supabase mode: check Supabase session
      checkSupabaseUser()

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadUserProfile(session.user.id)
        } else {
          setUser(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [isDemoMode])

  // Demo mode functions
  const checkLocalStorageUser = () => {
    try {
      const storedUser = localStorage.getItem('demo_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error checking localStorage:', error)
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]')
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        plan: foundUser.plan
      }
      setUser(userWithoutPassword)
      localStorage.setItem('demo_user', JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const demoRegister = (email: string, password: string, name: string): boolean => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]')

    // Check if email already exists
    if (users.some((u: any) => u.email === email)) {
      return false
    }

    const newUser = {
      id: `demo-${Date.now()}`,
      email,
      password, // In demo mode only, we store password
      name,
      plan: null,
      created_at: new Date().toISOString()
    }

    users.push(newUser)
    localStorage.setItem('demo_users', JSON.stringify(users))

    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      plan: newUser.plan
    }
    setUser(userWithoutPassword)
    localStorage.setItem('demo_user', JSON.stringify(userWithoutPassword))
    return true
  }

  const demoLogout = () => {
    localStorage.removeItem('demo_user')
    setUser(null)
  }

  const demoUpdatePlan = (planId: string) => {
    if (!user) return

    const updatedUser = { ...user, plan: planId }
    setUser(updatedUser)
    localStorage.setItem('demo_user', JSON.stringify(updatedUser))

    // Update in users array too
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]')
    const userIndex = users.findIndex((u: any) => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].plan = planId
      localStorage.setItem('demo_users', JSON.stringify(users))
    }
  }

  // Supabase mode functions
  const checkSupabaseUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          plan: data.plan
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isDemoMode) {
      return demoLogin(email, password)
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        await loadUserProfile(data.user.id)
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    if (isDemoMode) {
      return demoRegister(email, password, name)
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // El perfil se crea automáticamente con el trigger
        // Esperar un momento para que se cree el perfil
        await new Promise(resolve => setTimeout(resolve, 1000))
        await loadUserProfile(data.user.id)
        return true
      }

      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = async () => {
    if (isDemoMode) {
      demoLogout()
      return
    }

    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Expose demo mode update function
  if (typeof window !== 'undefined' && isDemoMode) {
    (window as any).updateDemoPlan = demoUpdatePlan
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      loading,
      isDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  Gift,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout, isDemoMode } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Productos', href: '/admin/products', icon: Package },
    { name: 'Mesas de Regalos', href: '/admin/registries', icon: Gift },
    { name: 'Reservaciones', href: '/admin/reservations', icon: ShoppingBag },
    { name: 'Usuarios', href: '/admin/users', icon: Users },
    { name: 'Configuración', href: '/admin/settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/admin" className="text-2xl font-serif font-semibold text-gray-800">
              Stoja Admin
            </Link>
            {isDemoMode && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                MODO DEMO
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Ver Sitio
            </Link>
            <div className="text-sm text-gray-600">
              {user?.name}
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 z-20 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 min-h-screen">
        {children}
      </main>
    </div>
  )
}

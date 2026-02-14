'use client'

import { Search, Menu, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ShoppingCart } from './ShoppingCart'
import { useState } from 'react'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/colecciones" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
            COLECCIONES
          </Link>
          <Link href="/planes" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
            PLANES
          </Link>
          {isAuthenticated ? (
            <Link href="/mi-cuenta" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              MI CUENTA
            </Link>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              MI CUENTA
            </Link>
          )}
        </div>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="text-2xl font-serif font-semibold text-gray-800 hover:text-teal-600 transition-colors">
            Stoja
          </div>
        </Link>

        {/* Right Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/buscar-mesa"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="font-medium">BUSCAR MESA</span>
          </Link>

          <ShoppingCart />

          {isAuthenticated ? (
            <>
              <Link
                href="/mi-cuenta"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.name}</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">SALIR</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="font-medium">INICIAR SESIÓN</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/colecciones"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              COLECCIONES
            </Link>
            <Link
              href="/planes"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              PLANES
            </Link>
            <Link
              href="/buscar-mesa"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              BUSCAR MESA
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/mi-cuenta"
                  className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  MI CUENTA
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2"
                >
                  SALIR
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block bg-teal-500 text-white text-center font-medium py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                INICIAR SESIÓN
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

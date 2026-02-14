'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, X, Filter } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string
  category?: string
  brand?: string
}

export default function ColeccionesPage() {
  const { isDemoMode } = useAuth()
  const { addToCart } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const DEMO_PRODUCTS: Product[] = [
    {
      id: 'prod-1',
      name: 'Juego de Cubiertos Premium',
      price: 299.99,
      description: 'Set completo de cubiertos de acero inoxidable',
      category: 'Cocina',
      brand: 'Le Creuset',
      image_url: 'https://ext.same-assets.com/414402080/3540778603.jpeg'
    },
    {
      id: 'prod-2',
      name: 'Set de Decoración Moderna',
      price: 449.99,
      description: 'Elementos decorativos para el hogar',
      category: 'Decoración',
      brand: 'indesign living',
      image_url: 'https://ext.same-assets.com/414402080/1211170396.jpeg'
    },
    {
      id: 'prod-3',
      name: 'Juego de Sábanas Premium',
      price: 199.99,
      description: 'Sábanas de algodón egipcio',
      category: 'Dormitorio',
      brand: 'Sofamania',
      image_url: 'https://ext.same-assets.com/414402080/3239978179.jpeg'
    },
    {
      id: 'prod-4',
      name: 'Set de Copas de Vino',
      price: 149.99,
      description: 'Juego de 6 copas de cristal',
      category: 'Cocina',
      brand: 'Le Creuset',
      image_url: 'https://ext.same-assets.com/414402080/3104962945.jpeg'
    },
    {
      id: 'prod-5',
      name: 'Batidora Premium',
      price: 399.99,
      description: 'Batidora de mano profesional',
      category: 'Cocina',
      brand: 'mabe',
      image_url: 'https://ext.same-assets.com/414402080/1021847894.jpeg'
    },
    {
      id: 'prod-6',
      name: 'Lámpara de Mesa Moderna',
      price: 179.99,
      description: 'Iluminación decorativa de diseño',
      category: 'Decoración',
      brand: 'indesign living',
      image_url: 'https://ext.same-assets.com/414402080/701023098.jpeg'
    },
    {
      id: 'prod-7',
      name: 'Juego de Toallas Premium',
      price: 89.99,
      description: 'Set de toallas de algodón',
      category: 'Baño',
      brand: 'Sofamania',
      image_url: 'https://ext.same-assets.com/414402080/1835651507.jpeg'
    },
    {
      id: 'prod-8',
      name: 'Olla de Cocción Lenta',
      price: 249.99,
      description: 'Olla eléctrica programable',
      category: 'Cocina',
      brand: 'mabe',
      image_url: 'https://ext.same-assets.com/414402080/3202036517.jpeg'
    }
  ]

  useEffect(() => {
    loadProducts()
  }, [isDemoMode])

  const loadProducts = async () => {
    setLoading(true)

    if (isDemoMode) {
      setProducts(DEMO_PRODUCTS)
    } else {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name')

        if (error) throw error
        setProducts(data || DEMO_PRODUCTS)
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts(DEMO_PRODUCTS)
      }
    }

    setLoading(false)
  }

  // Get unique values for filters
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]
  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))]

  // Filter products
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

    // Brand filter
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand

    // Price range filter
    let matchesPrice = true
    if (priceRange === 'under100') {
      matchesPrice = product.price < 100
    } else if (priceRange === '100-300') {
      matchesPrice = product.price >= 100 && product.price < 300
    } else if (priceRange === '300-500') {
      matchesPrice = product.price >= 300 && product.price < 500
    } else if (priceRange === 'over500') {
      matchesPrice = product.price >= 500
    }

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setPriceRange('all')
  }

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' ||
                          selectedBrand !== 'all' || priceRange !== 'all'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-semibold text-gray-800">
            Stoja
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-lg text-gray-600">
            Explora nuestro catálogo completo de productos para tu mesa de regalos
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg mb-4"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>

          {/* Filters */}
          <div className={`grid md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Todas las categorías' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand === 'all' ? 'Todas las marcas' : brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Precio
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">Todos los precios</option>
                <option value="under100">Menos de $100</option>
                <option value="100-300">$100 - $300</option>
                <option value="300-500">$300 - $500</option>
                <option value="over500">$500+</option>
              </select>
            </div>
          </div>

          {/* Active Filters and Clear */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} producto(s) encontrado(s)
              </p>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-teal-600 hover:text-teal-700"
              >
                <X className="w-4 h-4" />
                <span>Limpiar filtros</span>
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar los filtros o la búsqueda
            </p>
            <button
              onClick={clearFilters}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    * Este es un catálogo de referencia. Los productos se agregan a mesas específicas.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-serif mb-4">
            ¿Listo para crear tu mesa de regalos?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Elige los productos que más te gusten y compártelos con tus invitados
          </p>
          <Link
            href="/planes"
            className="inline-block bg-white text-teal-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Ver Planes
          </Link>
        </div>
      </div>
    </div>
  )
}

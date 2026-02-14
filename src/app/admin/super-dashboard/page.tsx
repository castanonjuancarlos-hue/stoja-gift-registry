'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield,
  Package,
  Image as ImageIcon,
  DollarSign,
  Settings,
  Users,
  Gift,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Upload,
  Save,
  X,
  CreditCard,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  Mail,
  User
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string
  category?: string
  brand?: string
}

interface SiteImage {
  id: string
  name: string
  url: string
  section: string
  alt_text?: string
}

interface UserData {
  id: string
  email: string
  name?: string
  plan?: string
  created_at?: string
}

interface GiftTableData {
  id: string
  event_name: string
  event_date: string
  event_type: string
  user_id: string
  slug?: string
  created_at?: string
}

interface PayPalConfig {
  client_id: string
  mode: 'sandbox' | 'live'
  currency: string
}

export default function SuperDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [siteImages, setSiteImages] = useState<SiteImage[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [giftTables, setGiftTables] = useState<GiftTableData[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPayPalSecret, setShowPayPalSecret] = useState(false)

  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    description: '',
    image_url: '',
    category: '',
    brand: ''
  })

  const [imageForm, setImageForm] = useState({
    name: '',
    url: '',
    section: 'hero',
    alt_text: ''
  })

  const [paypalConfig, setPaypalConfig] = useState<PayPalConfig>({
    client_id: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    mode: 'live',
    currency: 'USD'
  })

  const [siteSettings, setSiteSettings] = useState({
    site_name: 'Stoja',
    site_description: 'La mesa de regalos perfecta para tu evento especial',
    contact_email: 'contacto@stoja.mx',
    test_mode_prices: true,
    maintenance_mode: false
  })

  // Verificar autenticación de super admin
  useEffect(() => {
    const session = localStorage.getItem('super_admin_session')
    if (!session) {
      router.push('/admin/super-login')
      return
    }

    try {
      const parsed = JSON.parse(session)
      if (parsed.role !== 'super_admin') {
        router.push('/admin/super-login')
      }
    } catch {
      router.push('/admin/super-login')
    }

    loadProducts()
    loadSiteImages()
    loadUsers()
    loadGiftTables()
    loadSettings()
  }, [])

  const loadProducts = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setProducts(data)
      } else {
        // Modo demo si no hay Supabase
        const demoProducts = JSON.parse(localStorage.getItem('demo_products') || '[]')
        setProducts(demoProducts)
      }
    } catch {
      // Cargar desde localStorage en modo demo
      const demoProducts = JSON.parse(localStorage.getItem('demo_products') || '[]')
      setProducts(demoProducts)
    }
  }

  const loadSiteImages = () => {
    const images = JSON.parse(localStorage.getItem('site_images') || '[]')
    if (images.length === 0) {
      // Imágenes predeterminadas del sitio
      const defaultImages = [
        { id: '1', name: 'Hero Background', url: 'https://source.unsplash.com/1920x1080/?wedding,elegant', section: 'hero', alt_text: 'Hero Background' },
        { id: '2', name: 'How It Works', url: 'https://ext.same-assets.com/414402080/3540778603.jpeg', section: 'how-it-works', alt_text: 'Cubiertos Premium' },
        { id: '3', name: 'Gift Wrapping', url: 'https://ext.same-assets.com/414402080/1211170396.jpeg', section: 'services', alt_text: 'Decoración' },
      ]
      localStorage.setItem('site_images', JSON.stringify(defaultImages))
      setSiteImages(defaultImages)
    } else {
      setSiteImages(images)
    }
  }

  const loadUsers = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setUsers(data)
      } else {
        const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
        setUsers(demoUsers)
      }
    } catch {
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      setUsers(demoUsers)
    }
  }

  const loadGiftTables = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase
        .from('gift_tables')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setGiftTables(data)
      } else {
        const demoTables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
        setGiftTables(demoTables)
      }
    } catch {
      const demoTables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
      setGiftTables(demoTables)
    }
  }

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('site_settings')
    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings))
    }
    const savedPaypal = localStorage.getItem('paypal_config')
    if (savedPaypal) {
      setPaypalConfig(JSON.parse(savedPaypal))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('super_admin_session')
    router.push('/admin/super-login')
  }

  // Gestión de Productos
  const handleSaveProduct = async () => {
    if (!productForm.name || productForm.price <= 0) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      const { supabase } = await import('@/lib/supabase')

      if (editingProduct) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('products')
          .update(productForm)
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('products')
          .insert([productForm])

        if (error) throw error
      }

      alert('✅ Producto guardado exitosamente')
      setShowProductModal(false)
      setEditingProduct(null)
      setProductForm({ name: '', price: 0, description: '', image_url: '', category: '', brand: '' })
      loadProducts()
    } catch {
      // Modo demo - guardar en localStorage
      const products = JSON.parse(localStorage.getItem('demo_products') || '[]')

      if (editingProduct) {
        const index = products.findIndex((p: Product) => p.id === editingProduct.id)
        if (index !== -1) {
          products[index] = { ...editingProduct, ...productForm }
        }
      } else {
        const newProduct = {
          ...productForm,
          id: `prod-${Date.now()}`,
          created_at: new Date().toISOString()
        }
        products.push(newProduct)
      }

      localStorage.setItem('demo_products', JSON.stringify(products))
      alert('✅ Producto guardado (modo demo)')
      setShowProductModal(false)
      setEditingProduct(null)
      setProductForm({ name: '', price: 0, description: '', image_url: '', category: '', brand: '' })
      loadProducts()
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      alert('✅ Producto eliminado')
      loadProducts()
    } catch {
      // Modo demo
      const products = JSON.parse(localStorage.getItem('demo_products') || '[]')
      const filtered = products.filter((p: Product) => p.id !== productId)
      localStorage.setItem('demo_products', JSON.stringify(filtered))
      alert('✅ Producto eliminado (modo demo)')
      loadProducts()
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image_url: product.image_url || '',
      category: product.category || '',
      brand: product.brand || ''
    })
    setShowProductModal(true)
  }

  // Gestión de Imágenes
  const handleSaveImage = () => {
    if (!imageForm.name || !imageForm.url) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const images = JSON.parse(localStorage.getItem('site_images') || '[]')

    if (editingImage) {
      const index = images.findIndex((img: SiteImage) => img.id === editingImage.id)
      if (index !== -1) {
        images[index] = { ...editingImage, ...imageForm }
      }
    } else {
      const newImage = {
        ...imageForm,
        id: `img-${Date.now()}`
      }
      images.push(newImage)
    }

    localStorage.setItem('site_images', JSON.stringify(images))
    alert('✅ Imagen guardada exitosamente')
    setShowImageModal(false)
    setEditingImage(null)
    setImageForm({ name: '', url: '', section: 'hero', alt_text: '' })
    loadSiteImages()
  }

  const handleDeleteImage = (imageId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    const images = JSON.parse(localStorage.getItem('site_images') || '[]')
    const filtered = images.filter((img: SiteImage) => img.id !== imageId)
    localStorage.setItem('site_images', JSON.stringify(filtered))
    alert('✅ Imagen eliminada')
    loadSiteImages()
  }

  const handleEditImage = (image: SiteImage) => {
    setEditingImage(image)
    setImageForm({
      name: image.name,
      url: image.url,
      section: image.section,
      alt_text: image.alt_text || ''
    })
    setShowImageModal(true)
  }

  // Gestión de usuarios
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return

    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('profiles').delete().eq('id', userId)
      alert('✅ Usuario eliminado')
      loadUsers()
    } catch {
      const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
      const filtered = demoUsers.filter((u: UserData) => u.id !== userId)
      localStorage.setItem('demo_users', JSON.stringify(filtered))
      alert('✅ Usuario eliminado (modo demo)')
      loadUsers()
    }
  }

  // Gestión de mesas de regalos
  const handleDeleteGiftTable = async (tableId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta mesa de regalos?')) return

    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('gift_tables').delete().eq('id', tableId)
      alert('✅ Mesa de regalos eliminada')
      loadGiftTables()
    } catch {
      const demoTables = JSON.parse(localStorage.getItem('demo_gift_tables') || '[]')
      const filtered = demoTables.filter((t: GiftTableData) => t.id !== tableId)
      localStorage.setItem('demo_gift_tables', JSON.stringify(filtered))
      alert('✅ Mesa eliminada (modo demo)')
      loadGiftTables()
    }
  }

  // Guardar configuración de PayPal
  const handleSavePayPalConfig = () => {
    localStorage.setItem('paypal_config', JSON.stringify(paypalConfig))
    alert('✅ Configuración de PayPal guardada exitosamente')
  }

  // Guardar configuración del sitio
  const handleSaveSettings = () => {
    localStorage.setItem('site_settings', JSON.stringify(siteSettings))
    alert('✅ Configuración del sitio guardada exitosamente')
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredGiftTables = giftTables.filter(t =>
    t.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold">Super Administrador</h1>
                <p className="text-sm text-gray-400">Panel de Control Total - Stoja</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 md:space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Productos</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'images'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">Imágenes</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Usuarios</span>
            </button>

            <button
              onClick={() => setActiveTab('gift-tables')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'gift-tables'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="font-medium">Mesas de Regalos</span>
            </button>

            <button
              onClick={() => setActiveTab('paypal')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'paypal'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">PayPal</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configuración</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">Estadísticas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab: Productos */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setProductForm({ name: '', price: 0, description: '', image_url: '', category: '', brand: '' })
                  setShowProductModal(true)
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Producto</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay productos. Agrega tu primer producto.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg font-semibold text-green-600">${product.price}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{product.category || '-'}</td>
                          <td className="px-6 py-4 text-gray-700">{product.brand || '-'}</td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Imágenes */}
        {activeTab === 'images' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Imágenes del Sitio</h2>
              <button
                onClick={() => {
                  setEditingImage(null)
                  setImageForm({ name: '', url: '', section: 'hero', alt_text: '' })
                  setShowImageModal(true)
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Imagen</span>
              </button>
            </div>

            {/* Images Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteImages.length === 0 ? (
                <div className="col-span-full bg-white rounded-lg p-12 text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No hay imágenes. Agrega tu primera imagen.</p>
                </div>
              ) : (
                siteImages.map((image) => (
                  <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt_text || image.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{image.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">Sección: {image.section}</p>
                      <p className="text-xs text-gray-400 mb-3 truncate">{image.url}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditImage(image)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab: Usuarios */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <button
                onClick={loadUsers}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualizar</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar usuarios por email o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay usuarios registrados.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                                <User className="w-5 h-5 text-teal-600" />
                              </div>
                              <div className="font-medium text-gray-900">{user.name || 'Sin nombre'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-gray-600">
                              <Mail className="w-4 h-4 mr-2" />
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.plan === 'profesional' ? 'bg-purple-100 text-purple-800' :
                              user.plan === 'premium' ? 'bg-blue-100 text-blue-800' :
                              user.plan === 'basico' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.plan || 'Sin plan'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Mesas de Regalos */}
        {activeTab === 'gift-tables' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mesas de Regalos</h2>
              <button
                onClick={loadGiftTables}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualizar</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar mesas por nombre o slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Gift Tables Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredGiftTables.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay mesas de regalos creadas.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredGiftTables.map((table) => (
                        <tr key={table.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                                <Gift className="w-5 h-5 text-pink-600" />
                              </div>
                              <div className="font-medium text-gray-900">{table.event_name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{table.event_type}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(table.event_date).toLocaleDateString('es-ES')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {table.slug ? (
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">/mesa/{table.slug}</code>
                            ) : (
                              <span className="text-gray-400">Sin URL personalizada</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <a
                                href={`/mesa/${table.slug || table.id}`}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Eye className="w-5 h-5" />
                              </a>
                              <button
                                onClick={() => handleDeleteGiftTable(table.id)}
                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: PayPal Configuration */}
        {activeTab === 'paypal' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de PayPal</h2>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">PayPal Integración Activa</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Los pagos se procesan en tiempo real con PayPal.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PayPal Client ID
                  </label>
                  <div className="relative">
                    <input
                      type={showPayPalSecret ? 'text' : 'password'}
                      value={paypalConfig.client_id}
                      onChange={(e) => setPaypalConfig({ ...paypalConfig, client_id: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
                      placeholder="Tu PayPal Client ID"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPayPalSecret(!showPayPalSecret)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPayPalSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Obtén tu Client ID en developer.paypal.com
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo de PayPal
                  </label>
                  <select
                    value={paypalConfig.mode}
                    onChange={(e) => setPaypalConfig({ ...paypalConfig, mode: e.target.value as 'sandbox' | 'live' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="sandbox">Sandbox (Pruebas)</option>
                    <option value="live">Live (Producción)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select
                    value={paypalConfig.currency}
                    onChange={(e) => setPaypalConfig({ ...paypalConfig, currency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSavePayPalConfig}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar Configuración de PayPal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Sitio</h2>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Sitio
                  </label>
                  <input
                    type="text"
                    value={siteSettings.site_name}
                    onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del Sitio
                  </label>
                  <textarea
                    value={siteSettings.site_description}
                    onChange={(e) => setSiteSettings({ ...siteSettings, site_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={siteSettings.contact_email}
                    onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={siteSettings.test_mode_prices}
                        onChange={(e) => setSiteSettings({ ...siteSettings, test_mode_prices: e.target.checked })}
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-gray-700">Modo de precios de prueba ($0.01)</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={siteSettings.maintenance_mode}
                        onChange={(e) => setSiteSettings({ ...siteSettings, maintenance_mode: e.target.checked })}
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-gray-700">Modo de mantenimiento</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveSettings}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar Configuración</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Estadísticas */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas del Sitio</h2>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-blue-500" />
                  <span className="text-3xl font-bold text-gray-900">{products.length}</span>
                </div>
                <p className="text-gray-600 font-medium">Total Productos</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-green-500" />
                  <span className="text-3xl font-bold text-gray-900">{users.length}</span>
                </div>
                <p className="text-gray-600 font-medium">Usuarios Registrados</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <Gift className="w-8 h-8 text-pink-500" />
                  <span className="text-3xl font-bold text-gray-900">{giftTables.length}</span>
                </div>
                <p className="text-gray-600 font-medium">Mesas de Regalos</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <ImageIcon className="w-8 h-8 text-purple-500" />
                  <span className="text-3xl font-bold text-gray-900">{siteImages.length}</span>
                </div>
                <p className="text-gray-600 font-medium">Imágenes del Sitio</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Planes</h3>
                <div className="space-y-4">
                  {['profesional', 'premium', 'basico', 'sin plan'].map((plan) => {
                    const count = users.filter(u => (u.plan || 'sin plan') === plan).length
                    const percentage = users.length > 0 ? (count / users.length) * 100 : 0

                    return (
                      <div key={plan}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium capitalize">{plan}</span>
                          <span className="text-gray-600">{count} usuarios ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              plan === 'profesional' ? 'bg-purple-500' :
                              plan === 'premium' ? 'bg-blue-500' :
                              plan === 'basico' ? 'bg-green-500' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Productos por Categoría</h3>
                <div className="space-y-4">
                  {Array.from(new Set(products.map(p => p.category || 'Sin categoría'))).map((category) => {
                    const count = products.filter(p => (p.category || 'Sin categoría') === category).length
                    const percentage = products.length > 0 ? (count / products.length) * 100 : 0

                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">{category}</span>
                          <span className="text-gray-600">{count} productos ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Producto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false)
                  setEditingProduct(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Juego de Cubiertos Premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Descripción del producto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {productForm.image_url && (
                  <div className="mt-2">
                    <img
                      src={productForm.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666"%3ENo image%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ej: Cocina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ej: Le Creuset"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingProduct ? 'Actualizar' : 'Guardar'} Producto</span>
                </button>
                <button
                  onClick={() => {
                    setShowProductModal(false)
                    setEditingProduct(null)
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Imagen */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingImage ? 'Editar Imagen' : 'Agregar Nueva Imagen'}
              </h3>
              <button
                onClick={() => {
                  setShowImageModal(false)
                  setEditingImage(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Imagen *
                </label>
                <input
                  type="text"
                  value={imageForm.name}
                  onChange={(e) => setImageForm({ ...imageForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Hero Background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la Imagen *
                </label>
                <input
                  type="url"
                  value={imageForm.url}
                  onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {imageForm.url && (
                  <div className="mt-2">
                    <img
                      src={imageForm.url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sección del Sitio
                </label>
                <select
                  value={imageForm.section}
                  onChange={(e) => setImageForm({ ...imageForm, section: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="hero">Hero / Portada</option>
                  <option value="how-it-works">Cómo Funciona</option>
                  <option value="services">Servicios</option>
                  <option value="collections">Colecciones</option>
                  <option value="testimonials">Testimonios</option>
                  <option value="footer">Footer</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto Alternativo (Alt)
                </label>
                <input
                  type="text"
                  value={imageForm.alt_text}
                  onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Descripción de la imagen para accesibilidad"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveImage}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingImage ? 'Actualizar' : 'Guardar'} Imagen</span>
                </button>
                <button
                  onClick={() => {
                    setShowImageModal(false)
                    setEditingImage(null)
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  Save,
  Database,
  Mail,
  CreditCard,
  DollarSign,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Settings {
  [key: string]: string | boolean | number
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'database'>('general')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const [generalSettings, setGeneralSettings] = useState({
    commissionPercentage: 5,
    enablePayments: true,
    enableEmailNotifications: true,
    maintenanceMode: false
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    paypalMode: 'sandbox',
    supabaseUrl: '',
    supabaseKey: '',
    resendApiKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    stripePublishableKey: '',
    stripeSecretKey: ''
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)

    try {
      const { supabase } = await import('@/lib/supabase')

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')

      if (error) throw error

      // Convert data to settings objects
      const settingsMap: { [key: string]: string } = {}
      data?.forEach((item: any) => {
        settingsMap[item.setting_key] = item.setting_value
      })

      // Update general settings
      setGeneralSettings({
        commissionPercentage: parseFloat(settingsMap['commission_percentage'] || '5'),
        enablePayments: settingsMap['payments_enabled'] === 'true',
        enableEmailNotifications: settingsMap['email_notifications'] === 'true',
        maintenanceMode: settingsMap['maintenance_mode'] === 'true'
      })

      // Update integration settings
      setIntegrationSettings({
        paypalMode: settingsMap['paypal_mode'] || 'sandbox',
        supabaseUrl: settingsMap['supabase_url'] || '',
        supabaseKey: settingsMap['supabase_key'] || '',
        resendApiKey: settingsMap['resend_api_key'] || '',
        paypalClientId: settingsMap['paypal_client_id'] || '',
        paypalClientSecret: settingsMap['paypal_client_secret'] || '',
        stripePublishableKey: settingsMap['stripe_publishable_key'] || '',
        stripeSecretKey: settingsMap['stripe_secret_key'] || ''
      })
    } catch (error) {
      console.error('Error loading settings:', error)
      setMessage({ type: 'error', text: 'Error al cargar la configuración' })
    }

    setLoading(false)
  }

  const handleSaveGeneral = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const { supabase } = await import('@/lib/supabase')

      // Update each setting
      const updates = [
        { key: 'commission_percentage', value: generalSettings.commissionPercentage.toString() },
        { key: 'payments_enabled', value: generalSettings.enablePayments.toString() },
        { key: 'email_notifications', value: generalSettings.enableEmailNotifications.toString() },
        { key: 'maintenance_mode', value: generalSettings.maintenanceMode.toString() }
      ]

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ setting_value: update.value, updated_at: new Date().toISOString() })
          .eq('setting_key', update.key)

        if (error) throw error
      }

      setMessage({ type: 'success', text: 'Configuración guardada correctamente' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Error al guardar la configuración' })
    }

    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveIntegrations = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const { supabase } = await import('@/lib/supabase')

      const { error } = await supabase
        .from('site_settings')
        .update({
          setting_value: integrationSettings.paypalMode,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'paypal_mode')

      if (error) throw error

      setMessage({ type: 'success', text: 'Integraciones actualizadas correctamente' })
    } catch (error) {
      console.error('Error saving integrations:', error)
      setMessage({ type: 'error', text: 'Error al guardar las integraciones' })
    }

    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleExportData = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')

      // Export data from Supabase
      const [products, tables, items, purchases] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('gift_tables').select('*'),
        supabase.from('gift_table_items').select('*'),
        supabase.from('gift_purchases').select('*')
      ])

      const data = {
        products: products.data || [],
        tables: tables.data || [],
        items: items.data || [],
        purchases: purchases.data || []
      }

      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `stoja-backup-${new Date().toISOString()}.json`
      link.click()
      URL.revokeObjectURL(url)

      setMessage({ type: 'success', text: 'Datos exportados correctamente' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Error exporting data:', error)
      setMessage({ type: 'error', text: 'Error al exportar los datos' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleClearTestData = () => {
    alert('Esta función está deshabilitada en producción para proteger tus datos')
  }

  const tabs = [
    { id: 'general', name: 'General', icon: DollarSign },
    { id: 'integrations', name: 'Integraciones', icon: CreditCard },
    { id: 'database', name: 'Base de Datos', icon: Database }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
          Configuración
        </h1>
        <p className="text-gray-600">
          Gestiona la configuración de la plataforma
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-3" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-3" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    isActive
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Porcentaje de Comisión (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={generalSettings.commissionPercentage}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    commissionPercentage: parseFloat(e.target.value)
                  })
                }
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Comisión cobrada en cada transacción
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Habilitar Pagos</h3>
                  <p className="text-sm text-gray-500">
                    Permitir que los invitados realicen pagos
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalSettings.enablePayments}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        enablePayments: e.target.checked
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
                  <p className="text-sm text-gray-500">
                    Enviar emails automáticos a usuarios
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalSettings.enableEmailNotifications}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        enableEmailNotifications: e.target.checked
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <h3 className="font-medium text-gray-900">Modo Mantenimiento</h3>
                  <p className="text-sm text-gray-500">
                    Desactivar temporalmente el sitio para mantenimiento
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        maintenanceMode: e.target.checked
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveGeneral}
                disabled={saving}
                className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-teal-600" />
                Supabase
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supabase URL
                  </label>
                  <input
                    type="url"
                    value={integrationSettings.supabaseUrl}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        supabaseUrl: e.target.value
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://your-project.supabase.co"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supabase Anon Key
                  </label>
                  <input
                    type="password"
                    value={integrationSettings.supabaseKey}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        supabaseKey: e.target.value
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-teal-600" />
                Resend (Email)
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resend API Key
                </label>
                <input
                  type="password"
                  value={integrationSettings.resendApiKey}
                  onChange={(e) =>
                    setIntegrationSettings({
                      ...integrationSettings,
                      resendApiKey: e.target.value
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="re_..."
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-teal-600" />
                PayPal
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PayPal Client ID
                  </label>
                  <input
                    type="text"
                    value={integrationSettings.paypalClientId}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        paypalClientId: e.target.value
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modo
                  </label>
                  <select
                    value={integrationSettings.paypalMode}
                    onChange={(e) =>
                      setIntegrationSettings({
                        ...integrationSettings,
                        paypalMode: e.target.value
                      })
                    }
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="sandbox">Sandbox (Pruebas)</option>
                    <option value="production">Producción</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveIntegrations}
                disabled={saving}
                className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Integraciones'}
              </button>
            </div>
          </div>
        )}

        {/* Database */}
        {activeTab === 'database' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Utilidades de Base de Datos
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={handleExportData}
                  className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <div className="text-center">
                    <Download className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Exportar Datos</h4>
                    <p className="text-sm text-gray-500">
                      Descargar respaldo JSON
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => alert('Función no implementada')}
                  className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Importar Productos</h4>
                    <p className="text-sm text-gray-500">
                      Cargar desde CSV
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => alert('Función no implementada')}
                  className="flex items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Sincronizar</h4>
                    <p className="text-sm text-gray-500">
                      Actualizar datos
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleClearTestData}
                  className="flex items-center justify-center p-6 border-2 border-red-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  <div className="text-center">
                    <Trash2 className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Limpiar Datos</h4>
                    <p className="text-sm text-gray-500">
                      Eliminar datos de prueba
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Advertencia</h4>
                  <p className="text-sm text-yellow-800">
                    Las operaciones de base de datos son irreversibles. Asegúrate de tener un
                    respaldo antes de realizar cambios importantes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

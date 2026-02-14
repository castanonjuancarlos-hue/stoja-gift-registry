/**
 * Utility to verify Supabase configuration and connection
 * Use this to check if Supabase is properly set up
 */

import { supabase, isSupabaseConfigured } from './supabase'

interface VerificationResult {
  configured: boolean
  connected: boolean
  tablesExist: boolean
  errors: string[]
  warnings: string[]
}

export async function verifySupabaseSetup(): Promise<VerificationResult> {
  const result: VerificationResult = {
    configured: false,
    connected: false,
    tablesExist: false,
    errors: [],
    warnings: []
  }

  // Check 1: Is Supabase configured?
  if (!isSupabaseConfigured) {
    result.warnings.push('Supabase no está configurado. Usando modo demo.')
    return result
  }

  result.configured = true

  // Check 2: Can we connect to Supabase?
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)

    if (error) {
      result.errors.push(`Error de conexión: ${error.message}`)
      return result
    }

    result.connected = true
  } catch (err) {
    result.errors.push(`Error al conectar con Supabase: ${err}`)
    return result
  }

  // Check 3: Do required tables exist?
  const requiredTables = [
    'profiles',
    'gift_tables',
    'products',
    'gift_table_items',
    'gift_purchases',
    'payments'
  ]

  try {
    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('count').limit(1)

      if (error) {
        result.errors.push(`Tabla '${table}' no existe o no es accesible`)
      }
    }

    if (result.errors.length === 0) {
      result.tablesExist = true
    }
  } catch (err) {
    result.errors.push(`Error verificando tablas: ${err}`)
  }

  // Check 4: Are there products in the catalog?
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('count')

    if (error) {
      result.warnings.push('No se pudo verificar el catálogo de productos')
    } else if (!products || products.length === 0) {
      result.warnings.push('No hay productos en el catálogo. Ejecuta el script SQL completo.')
    }
  } catch (err) {
    result.warnings.push('No se pudo verificar el catálogo de productos')
  }

  return result
}

/**
 * Print verification results to console
 * Useful for debugging
 */
export async function printVerification() {
  console.log('🔍 Verificando configuración de Supabase...')

  const result = await verifySupabaseSetup()

  console.log('\n📊 Resultados:')
  console.log(`   Configurado: ${result.configured ? '✅' : '❌'}`)
  console.log(`   Conectado: ${result.connected ? '✅' : '❌'}`)
  console.log(`   Tablas creadas: ${result.tablesExist ? '✅' : '❌'}`)

  if (result.warnings.length > 0) {
    console.log('\n⚠️ Advertencias:')
    result.warnings.forEach(warning => console.log(`   - ${warning}`))
  }

  if (result.errors.length > 0) {
    console.log('\n❌ Errores:')
    result.errors.forEach(error => console.log(`   - ${error}`))
  }

  if (result.configured && result.connected && result.tablesExist) {
    console.log('\n✅ ¡Supabase está configurado correctamente!')
  } else if (!result.configured) {
    console.log('\n💡 Consejo: Lee SUPABASE_SETUP.md para configurar Supabase')
  } else {
    console.log('\n💡 Consejo: Revisa los errores y sigue la guía en SUPABASE_SETUP.md')
  }

  return result
}

// Export for use in components
export { isSupabaseConfigured }

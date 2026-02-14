import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is properly configured
export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  supabaseAnonKey !== 'tu-clave-anon-aqui'

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Types para TypeScript
export interface User {
  id: string
  email: string
  name: string
  plan?: string | null
  created_at?: string
}

export interface GiftTable {
  id: string
  user_id: string
  event_name: string
  event_date: string
  event_type: string
  location?: string
  description?: string
  slug?: string
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string
  category?: string
  brand?: string
}

export interface GiftTableItem {
  id: string
  gift_table_id: string
  product_id: string
  quantity: number
  reserved: boolean
  reserved_by?: string
}

export interface Invitation {
  id: string
  user_id: string
  gift_table_id?: string
  title: string
  couple_names: string
  event_date: string
  event_time: string
  ceremony_venue: string
  ceremony_address: string
  reception_venue?: string
  reception_address?: string
  dress_code: string
  dress_code_details?: string
  message?: string
  rsvp_deadline?: string
  map_url?: string
  cover_image?: string
  gallery_images?: string[]
  theme: string
  primary_color: string
  secondary_color: string
  font_family?: string
  template?: string
  is_published: boolean
  slug: string
  created_at?: string
  updated_at?: string
}

export interface Guest {
  id: string
  invitation_id: string
  name: string
  email: string
  phone?: string
  group_name?: string
  plus_ones: number
  dietary_restrictions?: string
  table_number?: string
  invitation_sent: boolean
  invitation_sent_at?: string
  rsvp_status: 'pending' | 'confirmed' | 'declined'
  rsvp_guests: number
  rsvp_message?: string
  rsvp_at?: string
  created_at?: string
}

export interface InvitationTemplate {
  id: string
  name: string
  description: string
  theme: string
  primary_color: string
  secondary_color: string
  font_family: string
  preview_image?: string
  category: string
}

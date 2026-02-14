-- IMPORTANTE: Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- Ve a: https://app.supabase.com -> Tu Proyecto -> SQL Editor

-- Tabla de usuarios (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mesas de regalos
CREATE TABLE IF NOT EXISTS public.gift_tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT DEFAULT 'Boda',
  location TEXT,
  description TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas por slug
CREATE INDEX IF NOT EXISTS idx_gift_tables_slug ON public.gift_tables(slug);

-- Tabla de productos/catálogo
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  brand TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items en una mesa de regalos
CREATE TABLE IF NOT EXISTS public.gift_table_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_table_id UUID REFERENCES public.gift_tables(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  reserved BOOLEAN DEFAULT FALSE,
  reserved_by TEXT,
  reserved_by_name TEXT,
  reserved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de compras de regalos (para invitados)
CREATE TABLE IF NOT EXISTS public.gift_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_table_id UUID REFERENCES public.gift_tables(id) ON DELETE CASCADE NOT NULL,
  gift_table_item_id UUID REFERENCES public.gift_table_items(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'paypal',
  payment_status TEXT DEFAULT 'completed',
  paypal_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos/transacciones
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'paypal',
  payment_status TEXT DEFAULT 'completed',
  paypal_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_table_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_purchases ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Cualquiera puede crear un perfil" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Políticas de seguridad para gift_tables
CREATE POLICY "Los usuarios pueden ver sus propias mesas" ON public.gift_tables
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Cualquiera puede ver mesas públicas" ON public.gift_tables
  FOR SELECT USING (true);

CREATE POLICY "Los usuarios pueden crear sus propias mesas" ON public.gift_tables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias mesas" ON public.gift_tables
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias mesas" ON public.gift_tables
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para products (todos pueden leer)
CREATE POLICY "Todos pueden ver productos" ON public.products
  FOR SELECT USING (true);

-- Políticas para gift_table_items
CREATE POLICY "Todos pueden ver items de mesas" ON public.gift_table_items
  FOR SELECT USING (true);

CREATE POLICY "Los dueños pueden gestionar items" ON public.gift_table_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.gift_tables
      WHERE gift_tables.id = gift_table_items.gift_table_id
      AND gift_tables.user_id = auth.uid()
    )
  );

-- Políticas para payments
CREATE POLICY "Los usuarios pueden ver sus propios pagos" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear pagos" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para gift_purchases
CREATE POLICY "Los dueños pueden ver compras de sus mesas" ON public.gift_purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.gift_tables
      WHERE gift_tables.id = gift_purchases.gift_table_id
      AND gift_tables.user_id = auth.uid()
    )
  );

CREATE POLICY "Cualquiera puede crear compras de regalos" ON public.gift_purchases
  FOR INSERT WITH CHECK (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gift_tables_updated_at BEFORE UPDATE ON public.gift_tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos productos de ejemplo
INSERT INTO public.products (name, price, description, category, brand, image_url) VALUES
  ('Juego de Cubiertos Premium', 299.99, 'Set completo de cubiertos de acero inoxidable', 'Cocina', 'Le Creuset', 'https://ext.same-assets.com/414402080/3540778603.jpeg'),
  ('Set de Decoración Moderna', 449.99, 'Elementos decorativos para el hogar', 'Decoración', 'indesign living', 'https://ext.same-assets.com/414402080/1211170396.jpeg'),
  ('Experiencia Romántica para Dos', 599.99, 'Cena romántica y spa para dos personas', 'Experiencias', 'Stoja Experiences', 'https://ext.same-assets.com/414402080/1021847894.jpeg'),
  ('Juego de Sábanas Premium', 199.99, 'Sábanas de algodón egipcio', 'Dormitorio', 'Sofamania', 'https://ext.same-assets.com/414402080/3239978179.jpeg'),
  ('Set de Copas de Vino', 149.99, 'Juego de 6 copas de cristal', 'Cocina', 'Le Creuset', 'https://ext.same-assets.com/414402080/3104962945.jpeg')
ON CONFLICT DO NOTHING;

-- Crear una función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil cuando se registra un nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabla de invitaciones digitales
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  gift_table_id UUID REFERENCES public.gift_tables(id) ON DELETE SET NULL,
  title TEXT DEFAULT 'Nuestra Boda',
  couple_names TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  ceremony_venue TEXT NOT NULL,
  ceremony_address TEXT,
  reception_venue TEXT,
  reception_address TEXT,
  dress_code TEXT DEFAULT 'formal',
  dress_code_details TEXT,
  message TEXT,
  rsvp_deadline DATE,
  map_url TEXT,
  cover_image TEXT,
  theme TEXT DEFAULT 'classic',
  primary_color TEXT DEFAULT '#0d9488',
  secondary_color TEXT DEFAULT '#f0fdfa',
  is_published BOOLEAN DEFAULT FALSE,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas por slug de invitaciones
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);

-- Tabla de confirmaciones RSVP
CREATE TABLE IF NOT EXISTS public.invitation_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  guests INTEGER DEFAULT 1,
  attending BOOLEAN DEFAULT TRUE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_rsvps ENABLE ROW LEVEL SECURITY;

-- Políticas para invitations
CREATE POLICY "Los usuarios pueden ver sus propias invitaciones" ON public.invitations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Cualquiera puede ver invitaciones publicadas" ON public.invitations
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Los usuarios pueden crear sus propias invitaciones" ON public.invitations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias invitaciones" ON public.invitations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias invitaciones" ON public.invitations
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para invitation_rsvps
CREATE POLICY "Los dueños pueden ver RSVPs de sus invitaciones" ON public.invitation_rsvps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_rsvps.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

CREATE POLICY "Cualquiera puede crear RSVPs" ON public.invitation_rsvps
  FOR INSERT WITH CHECK (true);

-- Trigger para actualizar updated_at en invitations
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabla de invitados para gestión de listas
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  group_name TEXT,
  plus_ones INTEGER DEFAULT 0,
  dietary_restrictions TEXT,
  table_number TEXT,
  invitation_sent BOOLEAN DEFAULT FALSE,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined')),
  rsvp_guests INTEGER DEFAULT 0,
  rsvp_message TEXT,
  rsvp_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas por invitation_id
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);

-- Habilitar RLS para guests
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Políticas para guests
CREATE POLICY "Los dueños pueden ver invitados de sus invitaciones" ON public.guests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guests.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

CREATE POLICY "Los dueños pueden gestionar invitados" ON public.guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guests.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

CREATE POLICY "Invitados pueden actualizar su RSVP" ON public.guests
  FOR UPDATE USING (true);

-- ¡Listo! Tu base de datos Supabase está configurada

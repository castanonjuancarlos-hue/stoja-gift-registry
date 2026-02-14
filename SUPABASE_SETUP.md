# Configuración de Supabase para Stoja

Esta guía te llevará paso a paso para configurar Supabase como tu base de datos en producción para Stoja.

## 📋 Requisitos Previos

- Una cuenta de email válida
- Acceso a internet
- Tu proyecto Stoja funcionando localmente

## 🎯 ¿Por qué usar Supabase?

**Modo Demo (actual):**
- ✅ Funciona sin configuración
- 📝 Datos guardados en `localStorage` (solo en tu navegador)
- ⚠️ Los datos se borran si limpias el navegador
- 👤 Solo tú puedes ver tus datos

**Modo Producción (con Supabase):**
- ✅ Base de datos real en la nube
- 🔒 Autenticación segura
- 🌍 Accesible desde cualquier dispositivo
- 💾 Datos persistentes y respaldados
- 👥 Multi-usuario real

## 🚀 Paso 1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Regístrate con:
   - GitHub (recomendado)
   - O tu email
4. Confirma tu email si es necesario
5. **ES GRATIS** - No necesitas tarjeta de crédito

## 🏗️ Paso 2: Crear tu proyecto

1. Una vez dentro, haz clic en **"New Project"**
2. Selecciona tu organización (o crea una nueva)
3. Configura tu proyecto:
   - **Name**: `stoja-production` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡guárdala!)
   - **Region**: Selecciona la más cercana a tu ubicación
     - `South America (São Paulo)` - Para Latinoamérica
     - `US East (N. Virginia)` - Para USA
   - **Pricing Plan**: Free (gratis)
4. Haz clic en **"Create new project"**
5. ⏳ Espera 1-2 minutos mientras se crea tu proyecto

## 🔑 Paso 3: Obtener tus credenciales

Una vez creado el proyecto:

1. En el menú lateral, ve a **Settings** ⚙️
2. Luego a **API**
3. Encontrarás dos valores importantes:

### Project URL
```
https://tu-proyecto-id.supabase.co
```

### Project API Key (anon public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Copia estos valores, los necesitarás en el siguiente paso.

## 🔧 Paso 4: Configurar credenciales en tu proyecto

1. Abre tu proyecto Stoja
2. Localiza el archivo `.env.local` en la raíz del proyecto
3. Reemplaza las líneas con tus credenciales reales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Guarda el archivo** (.env.local)

## 💾 Paso 5: Crear las tablas en la base de datos

Ahora vamos a crear todas las tablas necesarias:

1. En Supabase, ve al menú lateral y haz clic en **SQL Editor** 📝
2. Haz clic en **"New query"**
3. Abre el archivo `supabase-schema.sql` de tu proyecto Stoja
4. **Copia TODO el contenido** del archivo
5. **Pega** en el SQL Editor de Supabase
6. Haz clic en **"Run"** (▶️)
7. ✅ Deberías ver: "Success. No rows returned"

### ¿Qué acabas de crear?

El script crea:
- ✅ Tabla `profiles` - Perfiles de usuarios
- ✅ Tabla `gift_tables` - Mesas de regalos
- ✅ Tabla `products` - Catálogo de productos
- ✅ Tabla `gift_table_items` - Productos en cada mesa
- ✅ Tabla `gift_purchases` - Compras de invitados
- ✅ Tabla `payments` - Pagos de planes
- ✅ Políticas de seguridad (RLS)
- ✅ Triggers automáticos
- ✅ 5 productos de ejemplo

## 🔍 Paso 6: Verificar que todo funciona

1. En Supabase, ve a **Table Editor** 📊
2. Deberías ver todas las tablas creadas:
   - profiles
   - gift_tables
   - products
   - gift_table_items
   - gift_purchases
   - payments

3. Haz clic en **products**
4. Deberías ver 5 productos de ejemplo con imágenes

## ✅ Paso 7: Probar la conexión

1. **Reinicia tu servidor** de desarrollo:
```bash
cd zepika-clone
# Detén el servidor (Ctrl+C)
bun run dev
```

2. Abre tu aplicación en el navegador
3. La alerta de **"MODO DEMO"** ya NO debería aparecer
4. Ahora verás **autenticación real** de Supabase

## 🧪 Paso 8: Probar el registro

1. Ve a la página de **Registro**
2. Crea una cuenta con un email real
3. **Importante**: Revisa tu bandeja de entrada
4. Haz clic en el enlace de confirmación de Supabase
5. Vuelve a la app e inicia sesión

## 🎉 ¡Listo! Ahora estás en producción

Tu app ahora:
- ✅ Usa base de datos real
- ✅ Autenticación segura con Supabase
- ✅ Datos persistentes en la nube
- ✅ Multi-usuario funcional
- ✅ Listo para compartir con usuarios reales

## 🔐 Configuración de Autenticación (Opcional)

Para personalizar los emails de confirmación:

1. En Supabase, ve a **Authentication** → **Email Templates**
2. Personaliza los templates:
   - Confirmation email
   - Reset password
   - Magic link

3. Ve a **Authentication** → **URL Configuration**
4. Configura:
   - **Site URL**: `http://localhost:3000` (desarrollo) o tu dominio
   - **Redirect URLs**: Agrega URLs permitidas

## 📊 Monitorear tu base de datos

### Ver usuarios registrados
1. **Authentication** → **Users**
2. Aquí verás todos los usuarios que se registren

### Ver datos
1. **Table Editor**
2. Selecciona cualquier tabla
3. Verás todos los registros en tiempo real

### Ver logs
1. **Logs** → **Postgres Logs**
2. Útil para debuggear problemas

## 🚨 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que copiaste la clave completa
- Asegúrate de usar la clave "anon public" (no la "service_role")
- Reinicia el servidor

### Error: "Failed to fetch"
- Verifica que la URL de Supabase sea correcta
- Comprueba tu conexión a internet
- Revisa que el proyecto de Supabase esté activo

### No aparece el banner "MODO DEMO"
✅ ¡Perfecto! Significa que Supabase está configurado correctamente

### Sí aparece el banner "MODO DEMO"
- Verifica que `.env.local` tenga las credenciales correctas
- Asegúrate de haber reiniciado el servidor
- Comprueba que no haya espacios extra en las credenciales

### Los usuarios no reciben email de confirmación
1. Ve a **Authentication** → **Email Templates**
2. Verifica que los templates estén activos
3. Revisa la carpeta de spam

## 💡 Consejos Pro

### 1. Backup automático
Supabase hace backups automáticos en el plan Pro, pero puedes:
- Exportar datos manualmente desde Table Editor
- Usar la API de Supabase para backups programados

### 2. Monitoreo
- Activa las notificaciones de Supabase
- Revisa el dashboard regularmente
- Configura alertas para errores

### 3. Seguridad
- **NUNCA** compartas tu `service_role` key
- La clave en `.env.local` es pública (está bien)
- Usa Row Level Security (ya configurado)

### 4. Performance
- Supabase incluye índices automáticos
- Puedes agregar índices personalizados si es necesario
- El plan gratuito es suficiente para empezar

## 📈 Límites del Plan Gratuito

- **500 MB** de almacenamiento de base de datos
- **1 GB** de transferencia de datos
- **50,000** usuarios activos al mes
- **Unlimited** API requests

Más que suficiente para empezar. Si creces, puedes actualizar después.

## 🔄 Migrar de Demo a Supabase

Si ya tienes datos en modo demo y quieres migrarlos:

1. Los datos de demo están en `localStorage`
2. Tendrás que recrear manualmente:
   - Cuentas de usuario
   - Mesas de regalos
   - Productos agregados

**No hay migración automática** porque el modo demo es solo para pruebas locales.

## 📞 Soporte

### Documentación oficial
- [Docs de Supabase](https://supabase.com/docs)
- [Guía de Auth](https://supabase.com/docs/guides/auth)
- [Guía de Database](https://supabase.com/docs/guides/database)

### Comunidad
- [Discord de Supabase](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)

### Problemas del código
- Contacta a Same support en support@same.new

## 🎊 Próximos pasos

Una vez configurado Supabase:

1. ✅ Configura PayPal en producción
2. ✅ Configura Resend para emails (ver EMAIL_SETUP.md)
3. ✅ Despliega a Netlify o Vercel
4. ✅ Configura tu dominio personalizado
5. ✅ ¡Comparte con el mundo!

---

¿Listo para producción? ¡Sigue los pasos y tendrás tu plataforma funcionando en minutos! 🚀

# Stoja - Plataforma de Mesas de Regalos

Una plataforma moderna y completa para crear y gestionar mesas de regalos para eventos especiales.

## ✨ Características

- 🎁 **Mesas de Regalos Digitales**: Crea y gestiona listas de regalos para bodas, baby showers, cumpleaños y más
- 🔐 **Autenticación Segura**: Sistema dual con modo demo y Supabase
- 💳 **Pagos con PayPal**: Integración completa con PayPal para planes y regalos
- 📧 **Notificaciones por Email**: Emails automáticos con Resend cuando alguien regala
- 👥 **Invitados sin Cuenta**: Los invitados pueden regalar sin necesidad de registrarse
- 📱 **Responsive**: Funciona perfectamente en móvil, tablet y desktop
- 🎨 **Diseño Moderno**: UI atractiva con Tailwind CSS y shadcn/ui

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ o Bun
- Cuenta de Supabase (opcional, para producción)
- Cuenta de Resend (opcional, para emails)
- Cuenta de PayPal Developer (opcional, para pagos reales)

### Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repo>
cd zepika-clone
```

2. **Instala dependencias**
```bash
bun install
```

3. **Inicia el servidor de desarrollo**
```bash
bun run dev
```

4. **Abre tu navegador**
```
http://localhost:3000
```

¡Listo! La aplicación funcionará en **modo demo** sin configuración adicional.

## 🎭 Modo Demo vs Modo Producción

### Modo Demo (Sin configuración)
- ✅ Funciona inmediatamente
- 📝 Datos guardados en localStorage
- 🎭 Autenticación simulada
- 💳 Pagos simulados con PayPal
- 📧 Emails mostrados en consola
- ⚠️ Ideal para desarrollo y pruebas

### Modo Producción (Con Supabase)
- 🌐 Base de datos real en la nube
- 🔒 Autenticación real con Supabase
- 💾 Datos persistentes
- 👥 Multi-usuario
- 📧 Emails reales con Resend
- 💳 Pagos reales con PayPal
- ✅ Listo para usuarios reales

## 📚 Configuración para Producción

### 1. Configurar Supabase (Base de Datos)

Sigue la guía detallada en **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

Resumen rápido:
1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén URL y API Key
4. Actualiza `.env.local` con tus credenciales
5. Ejecuta el script SQL completo
6. Reinicia el servidor

### 2. Configurar Emails (Resend)

Sigue la guía detallada en **[EMAIL_SETUP.md](./EMAIL_SETUP.md)**

Resumen rápido:
1. Crea cuenta en [resend.com](https://resend.com)
2. Obtén tu API Key
3. Agrega `RESEND_API_KEY` a `.env.local`
4. Reinicia el servidor

### 3. Configurar PayPal (Pagos)

Para pagos reales:
1. Crea cuenta en [PayPal Developer](https://developer.paypal.com)
2. Obtén tu Client ID de producción
3. Reemplaza 'test' en los archivos:
   - `src/app/planes/page.tsx`
   - `src/app/mesa/[id]/page.tsx`

## 🔍 Verificar Configuración

Visita `/verificar-setup` en tu navegador para comprobar el estado de tu configuración de Supabase.

## 📁 Estructura del Proyecto

```
zepika-clone/
├── src/
│   ├── app/                    # Páginas de Next.js
│   │   ├── page.tsx           # Página principal
│   │   ├── login/             # Login
│   │   ├── registro/          # Registro
│   │   ├── planes/            # Planes y pagos
│   │   ├── mi-cuenta/         # Dashboard del usuario
│   │   ├── mis-mesas/         # Lista de mesas
│   │   ├── crear-mesa/        # Crear nueva mesa
│   │   ├── editar-mesa/       # Editar mesa
│   │   └── mesa/[id]/         # Vista pública de mesa
│   ├── components/            # Componentes reutilizables
│   ├── contexts/              # React Context (Auth)
│   └── lib/                   # Utilidades
│       ├── supabase.ts        # Cliente de Supabase
│       ├── email.ts           # Servicio de emails
│       └── verify-supabase.ts # Verificación de setup
├── supabase-schema.sql        # Schema de base de datos
├── SUPABASE_SETUP.md          # Guía de Supabase
├── EMAIL_SETUP.md             # Guía de emails
├── .env.local                 # Variables de entorno
└── package.json
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
bun run dev          # Inicia servidor de desarrollo

# Producción
bun run build        # Construye para producción
bun run start        # Inicia servidor de producción

# Calidad de código
bun run lint         # Ejecuta linter
bun run format       # Formatea código
```

## 🎁 Funcionalidades Principales

### Para Dueños de Mesas
1. **Crear Mesa de Regalos**
   - Nombre del evento
   - Fecha y ubicación
   - Descripción personalizada

2. **Agregar Productos**
   - Catálogo de productos con imágenes
   - Precios y descripciones
   - Gestión de inventario

3. **Compartir con Invitados**
   - URL única para cada mesa
   - Vista pública accesible sin login

4. **Recibir Notificaciones**
   - Email cuando alguien regala
   - Ver quién regaló cada producto

### Para Invitados
1. **Ver Mesa de Regalos**
   - Sin necesidad de cuenta
   - Ver productos disponibles y reservados

2. **Regalar Producto**
   - Formulario simple (nombre + email)
   - Pago seguro con PayPal
   - Confirmación por email

## 🔒 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Autenticación JWT
- ✅ Políticas de acceso configuradas
- ✅ Validación en servidor y cliente
- ✅ Sanitización de datos

## 🌐 Despliegue

### Netlify (Recomendado)

1. Conecta tu repositorio
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
3. Despliega

### Vercel

Similar a Netlify, Next.js está optimizado para Vercel.

## 📊 Base de Datos

### Tablas Principales

- **profiles**: Usuarios registrados
- **gift_tables**: Mesas de regalos
- **products**: Catálogo de productos
- **gift_table_items**: Productos en cada mesa
- **gift_purchases**: Compras de invitados
- **payments**: Pagos de planes

### Datos Demo

En modo demo, los datos se guardan en:
- `demo_users` (localStorage)
- `demo_gift_tables` (localStorage)
- `demo_gift_table_items` (localStorage)
- `demo_gift_purchases` (localStorage)
- `demo_payments` (localStorage)

## 🎨 Personalización

### Colores
Edita `tailwind.config.ts` para cambiar el tema de colores.

### Componentes
Los componentes shadcn/ui están en `src/components/ui/` y son completamente personalizables.

### Productos
Agrega productos en:
- Modo demo: `src/app/mesa/[id]/page.tsx` (array DEMO_PRODUCTS)
- Modo producción: Tabla `products` en Supabase

## 🐛 Solución de Problemas

### La app no inicia
```bash
# Limpia node_modules y reinstala
rm -rf node_modules bun.lock
bun install
```

### Modo demo no funciona
- Abre la consola del navegador (F12)
- Busca errores en localStorage
- Limpia localStorage y recarga

### Supabase no conecta
- Verifica credenciales en `.env.local`
- Visita `/verificar-setup` para diagnóstico
- Revisa que el proyecto Supabase esté activo

### Emails no se envían
- En modo demo: Revisa consola del navegador
- En producción: Verifica `RESEND_API_KEY`

## 📖 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Resend](https://resend.com/docs)
- [Documentación de PayPal](https://developer.paypal.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 💬 Soporte

- **Documentación**: Lee los archivos SETUP.md
- **Verificación**: Usa `/verificar-setup`
- **Problemas del código**: Same support (support@same.new)
- **Supabase**: Discord de Supabase
- **Resend**: Docs de Resend

---

Creado con ❤️ usando Next.js, Supabase, y Same IDE

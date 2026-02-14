# ⚡ Configuración Rápida - Stoja

Esta guía te llevará de **modo demo a producción** en 30-40 minutos.

## 🎯 Objetivo

Configurar:
1. ✅ Supabase (Base de datos)
2. ✅ Resend (Emails)
3. ✅ Verificar configuración
4. ✅ PayPal (Pagos)

---

## 📋 Antes de Empezar

### Lo que necesitas:
- ☕ 30-40 minutos de tiempo
- 📧 Una cuenta de email válida
- 💻 Acceso a tu proyecto en Same IDE

### Lo que NO necesitas:
- ❌ Tarjeta de crédito (todo es gratis)
- ❌ Conocimientos técnicos avanzados
- ❌ Experiencia previa con estas herramientas

---

## 1️⃣ SUPABASE (15-20 minutos)

### Paso 1.1: Crear cuenta en Supabase

1. Abre una nueva pestaña y ve a: **https://supabase.com**
2. Haz clic en **"Start your project"**
3. Regístrate con GitHub o tu email
4. Confirma tu email si te lo piden

### Paso 1.2: Crear proyecto

1. Haz clic en **"New Project"**
2. Completa:
   - **Name**: `stoja-production`
   - **Database Password**: Crea una contraseña segura
     - Ejemplo: `MiPassword123!Seguro`
     - **⚠️ IMPORTANTE: Guarda esta contraseña en un lugar seguro**
   - **Region**: Selecciona la más cercana:
     - América: `South America (São Paulo)`
     - USA: `US East (N. Virginia)`
   - **Plan**: FREE
3. Haz clic en **"Create new project"**
4. ⏳ Espera 1-2 minutos mientras se crea

### Paso 1.3: Obtener credenciales

1. Una vez creado, ve a **Settings** (⚙️ icono en menú lateral izquierdo)
2. Haz clic en **"API"**
3. Verás dos valores importantes:

**Project URL:**
```
https://abcdefghijklmnop.supabase.co
```
📋 Copia este valor

**anon public (API Key):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```
📋 Copia este valor

### Paso 1.4: Ejecutar SQL Schema

1. En Supabase, ve a **SQL Editor** (📝 icono en menú lateral)
2. Haz clic en **"New query"**
3. En Same IDE:
   - Abre el archivo `supabase-schema.sql`
   - **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
4. Vuelve a Supabase y **pega** el contenido en el editor
5. Haz clic en **"Run"** (▶️ botón verde)
6. ✅ Deberías ver: "Success. No rows returned"

### Paso 1.5: Verificar tablas creadas

1. Ve a **Table Editor** (📊 icono en menú lateral)
2. Deberías ver estas tablas:
   - profiles
   - gift_tables
   - products
   - gift_table_items
   - gift_purchases
   - payments
3. Haz clic en **products**
4. ✅ Deberías ver 5 productos con imágenes

### Paso 1.6: Configurar en Same IDE

1. En Same IDE, abre el archivo `.env.local`
2. Reemplaza estas líneas con tus valores reales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...tu-clave-completa-aqui
```

3. **Guarda el archivo** (Ctrl+S)

### Paso 1.7: Reiniciar servidor

1. En Same IDE, ve a la terminal
2. Detén el servidor (Ctrl+C)
3. Reinicia:
```bash
bun run dev
```

---

## 2️⃣ RESEND (5-10 minutos)

### Paso 2.1: Crear cuenta en Resend

1. Abre una nueva pestaña: **https://resend.com**
2. Haz clic en **"Get Started"** o **"Sign up"**
3. Regístrate con tu email o GitHub
4. Confirma tu email

### Paso 2.2: Obtener API Key

1. Una vez dentro, ve a **"API Keys"** (en el menú lateral)
2. Haz clic en **"Create API Key"**
3. Completa:
   - **Name**: `Stoja Production`
   - **Permission**: `Sending access`
4. Haz clic en **"Add"**
5. 📋 **COPIA LA CLAVE** (solo se muestra una vez)
   - Empieza con `re_`
   - Ejemplo: `re_AbCdEf123456_YourKeyHere`

### Paso 2.3: Configurar en Same IDE

1. Abre el archivo `.env.local`
2. Agrega esta línea (reemplaza con tu clave real):

```env
RESEND_API_KEY=re_AbCdEf123456_YourKeyHere
```

3. **Guarda el archivo** (Ctrl+S)

### Paso 2.4: Reiniciar servidor

```bash
# Ctrl+C para detener
bun run dev
```

---

## 3️⃣ VERIFICAR CONFIGURACIÓN (2 minutos)

### Paso 3.1: Visitar página de verificación

1. En tu navegador, ve a: `http://localhost:3000/verificar-setup`
2. Espera a que termine la verificación

### Paso 3.2: Revisar resultados

✅ **TODO BIEN** si ves:
- Supabase Configurado: ✅
- Conexión Exitosa: ✅
- Tablas Creadas: ✅
- Banner verde: "¡Todo está configurado correctamente!"

❌ **HAY PROBLEMAS** si ves:
- Algunas ❌ rojas
- Errores listados
- **Solución**: Lee los mensajes de error y revisa los pasos anteriores

### Paso 3.3: Probar registro

1. Ve a `http://localhost:3000/registro`
2. Crea una cuenta con un email real
3. **Revisa tu bandeja de entrada**
4. Haz clic en el link de confirmación de Supabase
5. Vuelve a la app e inicia sesión

✅ **Si funciona**: ¡Supabase está configurado correctamente!

---

## 4️⃣ PAYPAL (10 minutos)

### Paso 4.1: Crear cuenta PayPal Developer

1. Ve a: **https://developer.paypal.com**
2. Haz clic en **"Log in to Dashboard"**
3. Inicia sesión con tu cuenta PayPal (o crea una)

### Paso 4.2: Crear App

1. Ve a **"My Apps & Credentials"**
2. En la sección **"REST API apps"**, haz clic en **"Create App"**
3. Completa:
   - **App Name**: `Stoja`
   - **App Type**: `Merchant`
4. Haz clic en **"Create App"**

### Paso 4.3: Obtener Client ID

1. Una vez creada la app, verás dos tabs:
   - **Sandbox** (para pruebas)
   - **Live** (para producción real)

2. **Para pruebas**: Usa el Client ID de **Sandbox**
3. **Para producción**: Usa el Client ID de **Live**

📋 Copia el **Client ID** (es una cadena larga)

### Paso 4.4: Configurar en el código

**PayPal requiere editar directamente los archivos de código:**

#### Archivo 1: `src/app/planes/page.tsx`

1. Abre el archivo en Same IDE
2. Busca la línea **~82** (usa Ctrl+G para ir a la línea)
3. Busca esta línea:
```typescript
script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD'
```

4. Reemplaza `test` con tu Client ID real:
```typescript
script.src = 'https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID_AQUI&currency=USD'
```

5. Guarda (Ctrl+S)

#### Archivo 2: `src/app/mesa/[id]/page.tsx`

1. Abre el archivo
2. Busca la línea **~113**
3. Busca la misma línea de script:
```typescript
script.src = 'https://www.paypal.com/sdk/js?client-id=test&currency=USD'
```

4. Reemplaza `test` con tu Client ID real:
```typescript
script.src = 'https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID_AQUI&currency=USD'
```

5. Guarda (Ctrl+S)

### Paso 4.5: Reiniciar servidor

```bash
# Ctrl+C para detener
bun run dev
```

---

## ✅ VERIFICACIÓN FINAL

### Checklist completo:

- [ ] ✅ Cuenta de Supabase creada
- [ ] ✅ Proyecto de Supabase creado
- [ ] ✅ SQL Schema ejecutado
- [ ] ✅ Credenciales de Supabase en `.env.local`
- [ ] ✅ Cuenta de Resend creada
- [ ] ✅ API Key de Resend en `.env.local`
- [ ] ✅ Página `/verificar-setup` muestra todo ✅
- [ ] ✅ Registro de usuario funciona
- [ ] ✅ Email de confirmación recibido
- [ ] ✅ Cuenta de PayPal Developer creada
- [ ] ✅ Client ID de PayPal en ambos archivos
- [ ] ✅ Servidor reiniciado
- [ ] ✅ Banner "MODO DEMO" ha desaparecido

### Probar funcionalidades:

1. **Registro y Login**:
   - Crea una cuenta
   - Confirma por email
   - Inicia sesión
   - ✅ Funciona si te lleva a /planes

2. **Crear Mesa de Regalos**:
   - Ve a "Mis Mesas"
   - Crea una nueva mesa
   - Agrega productos
   - Comparte el enlace
   - ✅ Funciona si ves la mesa creada

3. **Regalar (como invitado)**:
   - Abre el enlace de la mesa en modo incógnito
   - Haz clic en "Regalar"
   - Completa nombre y email
   - Procesa pago con PayPal Sandbox
   - ✅ Funciona si se marca como reservado

4. **Emails**:
   - Regala un producto
   - Revisa email del dueño
   - Revisa email del invitado
   - ✅ Funciona si ambos reciben emails

---

## 🎉 ¡FELICIDADES!

Tu plataforma Stoja está **100% funcional en producción**:

- ✅ Base de datos real con Supabase
- ✅ Autenticación segura
- ✅ Emails automáticos con Resend
- ✅ Pagos con PayPal
- ✅ Multi-usuario real
- ✅ Datos persistentes en la nube

---

## 🚀 Próximos Pasos

1. **Desplegar a internet**: Lee la documentación de Netlify/Vercel
2. **Dominio personalizado**: Configura tu propio dominio
3. **PayPal Live**: Cambia a Client ID de producción
4. **Dominio de email**: Configura dominio en Resend para mejor deliverability

---

## 🆘 ¿Problemas?

### Supabase no conecta
- Verifica que copiaste la URL completa
- Asegúrate de usar la clave "anon public", no "service_role"
- Reinicia el servidor

### Emails no se envían
- Verifica que la clave empiece con `re_`
- Revisa la consola del navegador por errores
- Comprueba que reiniciaste el servidor

### PayPal no funciona
- Verifica que reemplazaste `test` en AMBOS archivos
- Asegúrate de copiar el Client ID completo
- Usa el de Sandbox para pruebas

### Aún en modo demo
- Revisa `/verificar-setup`
- Verifica que `.env.local` tenga las credenciales correctas
- Asegúrate de haber reiniciado el servidor

---

## 📚 Más Información

- **SUPABASE_SETUP.md**: Guía detallada de Supabase
- **EMAIL_SETUP.md**: Guía detallada de Resend
- **README.md**: Documentación completa
- **/verificar-setup**: Diagnóstico en tu app

---

**¿Listo para comenzar? ¡Empieza por el Paso 1!** 🚀

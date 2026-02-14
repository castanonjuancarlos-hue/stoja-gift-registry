# Configuración de Notificaciones por Email

Esta guía te ayudará a configurar las notificaciones por email para tu aplicación Stoja usando Resend.

## 📧 ¿Qué son las notificaciones por email?

Cuando un invitado regala algo en una mesa de regalos, el sistema envía automáticamente:

1. **Email al dueño de la mesa**: Notificándole del nuevo regalo recibido
2. **Email al invitado**: Confirmación de su compra

## 🎭 Modo Demo vs Producción

### Modo Demo (SIN configurar Resend)
- ✅ La aplicación funciona perfectamente
- 📝 Los emails se "simulan" (se muestran en consola del navegador)
- 🔍 Puedes ver en la consola qué emails se enviarían

### Modo Producción (CON Resend configurado)
- ✅ Se envían emails reales a los usuarios
- 📨 Emails profesionales con diseño atractivo
- 🚀 Totalmente automático

## 🚀 Paso 1: Crear cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Haz clic en "Get Started"
3. Regístrate con tu email o GitHub
4. Es **100% GRATIS** para hasta 3,000 emails al mes

## 🔑 Paso 2: Obtener tu API Key

1. Una vez dentro, ve a **API Keys** en el menú lateral
2. Haz clic en "Create API Key"
3. Dale un nombre: "Stoja Production"
4. Selecciona permiso: "Sending access"
5. Haz clic en "Add"
6. **Copia la clave** (solo se muestra una vez)

## 🔧 Paso 3: Configurar en tu proyecto

1. Abre el archivo `.env.local` en tu proyecto
2. Agrega esta línea:

```env
RESEND_API_KEY=re_tu_clave_aqui
```

3. Reemplaza `re_tu_clave_aqui` con tu clave real de Resend

## ⚙️ Paso 4: Configurar dominio (Opcional pero recomendado)

Por defecto, los emails se envían desde `onboarding@resend.dev`. Para usar tu propio dominio:

1. En Resend, ve a **Domains**
2. Haz clic en "Add Domain"
3. Ingresa tu dominio (ej: `stoja.com`)
4. Sigue las instrucciones para agregar los registros DNS
5. Una vez verificado, actualiza el código en `src/lib/email.ts`:

```typescript
from: 'Stoja <noreply@tudominio.com>',
```

## 🎨 Personalizar los Emails

Los templates de email están en `src/lib/email.ts`:

- **createOwnerEmailTemplate**: Email para el dueño de la mesa
- **createGuestEmailTemplate**: Email de confirmación para el invitado

Puedes editar el HTML para cambiar:
- Colores
- Texto
- Imágenes
- Diseño

## 📊 Monitorear Envíos

1. Ve a tu dashboard de Resend
2. Haz clic en **Emails** en el menú lateral
3. Verás todos los emails enviados con:
   - Estado de entrega
   - Destinatario
   - Asunto
   - Fecha y hora

## 🔍 Probar las Notificaciones

### En Modo Demo (sin Resend):

1. Crea una mesa de regalos
2. Comparte el enlace
3. En otra ventana, regala un producto
4. Abre la **Consola del Navegador** (F12)
5. Verás: `📧 [DEMO MODE] Email que se enviaría...`

### En Modo Producción (con Resend):

1. Asegúrate de tener `RESEND_API_KEY` configurada
2. Reinicia el servidor de desarrollo
3. Regala un producto
4. ¡Los emails se enviarán inmediatamente!
5. Revisa tu bandeja de entrada

## ✅ Verificar que funciona

Después de configurar Resend:

1. Reinicia el servidor:
```bash
cd zepika-clone
bun run dev
```

2. Abre la consola del navegador (F12)
3. Regala un producto
4. **NO** deberías ver `[DEMO MODE]` en la consola
5. Deberías ver: `✅ Email enviado al dueño:` y `✅ Email enviado al invitado:`

## 🎁 Contenido de los Emails

### Email al Dueño:
- 🎉 Encabezado festivo
- 📦 Nombre del producto y precio
- 👤 Nombre y email del invitado que regaló
- 💌 Diseño profesional con gradientes

### Email al Invitado:
- ✓ Confirmación de compra
- 📋 Resumen del regalo
- 💰 Monto pagado
- 🎊 Agradecimiento personalizado

## ❓ Problemas Comunes

### Los emails no se envían

1. Verifica que `RESEND_API_KEY` esté en `.env.local`
2. Asegúrate de haber reiniciado el servidor
3. Revisa la consola del navegador por errores
4. Verifica que la clave API sea correcta

### Los emails van a spam

1. Configura tu propio dominio en Resend
2. Agrega registros SPF y DKIM
3. Calienta el dominio enviando emails gradualmente

### Error "Invalid API Key"

1. Verifica que copiaste la clave completa
2. Asegúrate de que no haya espacios adicionales
3. Genera una nueva clave en Resend si es necesario

## 💰 Límites Gratuitos de Resend

- **3,000 emails/mes** - Totalmente gratis
- **100 emails/día** en el plan gratuito
- Perfecto para empezar

Si necesitas más, los planes pagos son muy accesibles.

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs de Resend
3. Contacta a Same support si es un problema del código

## 🎉 ¡Listo!

Una vez configurado, tus usuarios recibirán emails automáticamente cada vez que:
- Alguien regale un producto
- Un invitado complete un pago

¡Disfruta de tu plataforma Stoja con notificaciones profesionales por email!

import { Resend } from 'resend'

// Initialize Resend with API key (will work in production, demo mode in development)
const resendApiKey = process.env.RESEND_API_KEY || 'demo-key'
const resend = new Resend(resendApiKey)

// Check if email is configured
export const isEmailConfigured = resendApiKey !== 'demo-key'

interface SendGiftNotificationParams {
  ownerEmail: string
  ownerName: string
  eventName: string
  productName: string
  productPrice: number
  guestName: string
  guestEmail: string
}

interface SendGuestConfirmationParams {
  guestEmail: string
  guestName: string
  eventName: string
  productName: string
  productPrice: number
  ownerName: string
}

// Email template for owner notification
function createOwnerEmailTemplate({
  ownerName,
  eventName,
  productName,
  productPrice,
  guestName,
  guestEmail
}: SendGiftNotificationParams) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300;">🎁 ¡Tienes un nuevo regalo!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #111827;">Hola ${ownerName},</p>

              <p style="margin: 0 0 20px; font-size: 16px; color: #4b5563; line-height: 1.6;">
                ¡Buenas noticias! Alguien acaba de regalarte algo para <strong>${eventName}</strong>.
              </p>

              <!-- Gift Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdfa; border-left: 4px solid #14b8a6; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Detalles del Regalo</p>
                    <h2 style="margin: 0 0 10px; font-size: 24px; color: #14b8a6;">${productName}</h2>
                    <p style="margin: 0 0 15px; font-size: 20px; color: #111827; font-weight: bold;">$${productPrice.toFixed(2)}</p>
                    <hr style="border: none; border-top: 1px solid #d1d5db; margin: 15px 0;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                      <strong>Regalado por:</strong> ${guestName}<br>
                      <strong>Email:</strong> ${guestEmail}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Puedes ver todos tus regalos en tu mesa de regalos de Stoja.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; font-size: 20px;">💝</p>
              <p style="margin: 0 0 5px; font-size: 14px; color: #6b7280;">
                Con cariño,
              </p>
              <p style="margin: 0; font-size: 16px; color: #14b8a6; font-weight: bold;">
                El equipo de Stoja
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer Note -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Este email fue enviado por Stoja - Plataforma de Mesas de Regalos
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Email template for guest confirmation
function createGuestEmailTemplate({
  guestName,
  eventName,
  productName,
  productPrice,
  ownerName
}: SendGuestConfirmationParams) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300;">✓ ¡Gracias por tu regalo!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #111827;">Hola ${guestName},</p>

              <p style="margin: 0 0 20px; font-size: 16px; color: #4b5563; line-height: 1.6;">
                ¡Gracias por tu generoso regalo! Tu compra ha sido procesada exitosamente.
              </p>

              <!-- Purchase Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border-left: 4px solid #22c55e; margin: 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Resumen de tu Regalo</p>
                    <h2 style="margin: 0 0 10px; font-size: 24px; color: #22c55e;">${productName}</h2>
                    <p style="margin: 0 0 15px; font-size: 20px; color: #111827; font-weight: bold;">$${productPrice.toFixed(2)}</p>
                    <hr style="border: none; border-top: 1px solid #d1d5db; margin: 15px 0;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                      <strong>Para:</strong> ${eventName}<br>
                      <strong>Anfitrión:</strong> ${ownerName}
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 6px; margin: 20px 0;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.5;">
                      <strong>📧 Confirmación de pago:</strong> Recibirás un email separado de PayPal con los detalles de la transacción.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                ${ownerName} ha sido notificado de tu regalo. ¡Estamos seguros de que les encantará!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; font-size: 20px;">💝</p>
              <p style="margin: 0 0 5px; font-size: 14px; color: #6b7280;">
                Gracias por usar
              </p>
              <p style="margin: 0; font-size: 16px; color: #14b8a6; font-weight: bold;">
                Stoja - Mesas de Regalos
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer Note -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Este email fue enviado por Stoja - Plataforma de Mesas de Regalos
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Send notification to gift table owner
export async function sendGiftNotificationToOwner(params: SendGiftNotificationParams) {
  if (!isEmailConfigured) {
    console.log('📧 [DEMO MODE] Email que se enviaría al dueño:', {
      to: params.ownerEmail,
      subject: `🎁 Nuevo regalo para ${params.eventName}`,
      from: params.guestName
    })
    return { success: true, demo: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Stoja <onboarding@resend.dev>',
      to: [params.ownerEmail],
      subject: `🎁 ¡Nuevo regalo para ${params.eventName}!`,
      html: createOwnerEmailTemplate(params)
    })

    if (error) {
      console.error('Error sending owner notification:', error)
      return { success: false, error }
    }

    console.log('✅ Email enviado al dueño:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Send confirmation to guest
export async function sendGuestConfirmation(params: SendGuestConfirmationParams) {
  if (!isEmailConfigured) {
    console.log('📧 [DEMO MODE] Email que se enviaría al invitado:', {
      to: params.guestEmail,
      subject: '✓ Confirmación de tu regalo',
      product: params.productName
    })
    return { success: true, demo: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Stoja <onboarding@resend.dev>',
      to: [params.guestEmail],
      subject: `✓ Confirmación de tu regalo - ${params.eventName}`,
      html: createGuestEmailTemplate(params)
    })

    if (error) {
      console.error('Error sending guest confirmation:', error)
      return { success: false, error }
    }

    console.log('✅ Email enviado al invitado:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

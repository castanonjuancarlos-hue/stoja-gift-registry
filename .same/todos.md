# Stoja - Wedding Platform Todos

## Completed
- [x] Created invitation section in Mi Cuenta page
- [x] Built invitation editing page at /invitaciones/[id]
  - [x] Event details (title, couple names, date, time)
  - [x] Location settings (ceremony venue, reception venue, addresses)
  - [x] Google Maps integration
  - [x] Dress code selection (8 options now)
  - [x] Design customization (12 themes, 12 colors)
  - [x] Share functionality (copy link, native sharing)
  - [x] Preview modal
  - [x] Publish toggle
- [x] Created public invitation page at /invitacion/[slug]
  - [x] Beautiful hero section with countdown
  - [x] Event details display
  - [x] Map link integration
  - [x] Dress code display
  - [x] RSVP confirmation form
  - [x] Gift table section with link
- [x] Updated Supabase schema with invitations and invitation_rsvps tables

### Guest Management
- [x] Added guests table to Supabase schema
- [x] Guest list management in invitation editor
- [x] Add/delete guests functionality
- [x] RSVP status tracking (pending, confirmed, declined)
- [x] Statistics dashboard (total, confirmed, pending, declined)
- [x] Send invitations button (marks as sent)
- [x] Per-guest email sending

### Gift Table Connection
- [x] Gift table selector in invitation editor
- [x] Link invitation to existing gift tables
- [x] Gift table section on public invitation page
- [x] "Ver Mesa de Regalos" button on invitation

### Templates & Themes
- [x] 10 pre-designed templates
- [x] 12 theme options
- [x] 12 color palette options
- [x] 3 font family options (Serif, Sans Serif, Script)
- [x] 8 dress code options

### QR Code Generation (NEW - Feb 2026)
- [x] QR code in invitation editor (Compartir tab)
- [x] QR code download as PNG
- [x] QR code on public invitation page
- [x] Floating share/QR buttons on public invitation
- [x] QR modal with download and share options
- [x] Copy invitation link functionality
- [x] Native share API integration

### Photo Gallery (NEW - Feb 2026)
- [x] Gallery tab in invitation editor
- [x] Add/remove gallery images via URL
- [x] Gallery section on public invitation page
- [x] Lightbox modal for full-screen viewing
- [x] Gallery navigation (prev/next)
- [x] Image counter in lightbox

### PayPal Integration Improvements (NEW - Feb 2026)
- [x] Environment variable validation for PAYPAL_CLIENT_ID
- [x] Graceful fallback to demo mode when not configured
- [x] Clear error messages when PayPal fails to load
- [x] Visual indicators for PayPal status (active/demo)
- [x] Consistent PayPal behavior across all pages (planes, mesa)

## Pending Enhancements
- [ ] Email integration with Resend for actual email sending
- [ ] CSV import for guest lists
- [ ] Music/audio on public invitation page
- [ ] WhatsApp direct sharing integration
- [ ] Multiple QR code styles/designs
- [ ] Image upload (not just URL) for gallery

## PayPal Configuration
To enable real PayPal payments, set the following environment variable:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

Get your PayPal Client ID from:
1. Go to https://developer.paypal.com/
2. Create or login to your PayPal Developer account
3. Go to Dashboard > My Apps & Credentials
4. Create a new app or use existing one
5. Copy the Client ID (use Sandbox for testing, Live for production)

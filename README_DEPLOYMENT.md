# 🚀 Deployment Quick Start

## ⚠️ IMPORTANT: Read This First!

Your **Stoja** app is built with **Next.js** and **cannot be deployed to GoDaddy shared hosting**.

---

## Why Not GoDaddy?

GoDaddy shared hosting only supports static HTML files. Your app needs:
- ✅ Node.js server
- ✅ Server-side rendering
- ✅ API routes
- ✅ Database connectivity

**None of these work on GoDaddy shared hosting.**

---

## ✅ Recommended Solution: Deploy to Netlify (FREE)

### Your app is ready! It takes 5 minutes:

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Choose:** GitHub → Select "Stoja" repository
4. **Add these environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   RESEND_API_KEY=your_resend_key (optional)
   ```
5. **Click:** "Deploy site"

**Done! Your site is live.** 🎉

---

## 📱 Connect Your GoDaddy Domain to Netlify

Keep your GoDaddy domain, point it to Netlify:

1. Deploy to Netlify first
2. In Netlify: Add custom domain
3. In GoDaddy: Update nameservers to Netlify's
4. Wait 24 hours for DNS propagation

**Detailed steps in:** `GODADDY_DEPLOYMENT_GUIDE.md`

---

## 📚 Full Guides

- **Netlify Deployment:** See `NETLIFY_DEPLOYMENT_STEPS.md`
- **GoDaddy Details:** See `GODADDY_DEPLOYMENT_GUIDE.md`
- **Quick Reference:** See `QUICK_DEPLOY.md`

---

## 🆘 Need Help?

1. Read `NETLIFY_DEPLOYMENT_STEPS.md` for detailed instructions
2. Your GitHub repo: https://github.com/castanonjuancarlos-hue/Stoja
3. Netlify docs: https://docs.netlify.com

---

**🎯 Bottom Line:** Use Netlify (free, easy, 5 minutes). Your app won't work on GoDaddy shared hosting.

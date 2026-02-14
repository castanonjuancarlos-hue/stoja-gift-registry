# ⚡ Quick Deploy Reference

## 1️⃣ Push to GitHub (Run in Terminal)

```bash
# Navigate to project
cd zepika-clone

# Add your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/zepika-clone.git

# Push to GitHub
git push -u origin main
```

**Create GitHub repo first:** https://github.com/new
- Name: `zepika-clone`
- Private or Public
- Don't initialize with anything

---

## 2️⃣ Deploy on Netlify (Web Browser)

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Choose:** "Deploy with GitHub"
4. **Select:** Your `zepika-clone` repository

---

## 3️⃣ Add Environment Variables (Before Deploy!)

In Netlify: **Site settings** → **Environment variables**

### Required:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key...
```

### Optional:
```
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

---

## 4️⃣ Deploy!

Click **"Deploy site"** and wait 2-5 minutes.

---

## 🔄 Making Updates

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Netlify auto-deploys in ~3 minutes! ✨

---

**Need detailed help?** See `NETLIFY_DEPLOYMENT_STEPS.md`

# 🚀 Netlify Deployment Guide - Step by Step

Your project is ready to deploy! Follow these steps to get your Zepika clone live on Netlify.

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:
- ✅ A GitHub account (sign up at https://github.com/signup if needed)
- ✅ A Netlify account (sign up at https://app.netlify.com if needed)
- ✅ Your Supabase credentials ready (URL and anon key)
- ✅ (Optional) Resend API key for email functionality

---

## Step 1: Push to GitHub

### 1.1 Create a New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `zepika-clone` (or any name you prefer)
3. **Keep it Private** (recommended) or Public
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### 1.2 Connect and Push Your Code

GitHub will show you commands. You'll need to run these in your terminal:

**Open the terminal in Same** and run:

```bash
cd zepika-clone

# Add your GitHub repository as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/zepika-clone.git

# Push your code
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Create token at: https://github.com/settings/tokens
  - Select scope: `repo` (full control of private repositories)

---

## Step 2: Deploy to Netlify

### 2.1 Log in to Netlify

1. Go to https://app.netlify.com
2. Sign in (or sign up if you don't have an account)
3. You can sign in with your GitHub account for easier integration

### 2.2 Import Your Project

1. Click **"Add new site"** button (top right)
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. **Authorize Netlify** to access your GitHub account (if first time)
5. Find and select your `zepika-clone` repository from the list

### 2.3 Configure Build Settings

Netlify should auto-detect these settings from your `netlify.toml` file:

```
Build command: bun run build
Publish directory: (leave empty - handled by Next.js plugin)
```

**You should see:**
- ✅ Build command detected
- ✅ Next.js framework detected
- ✅ Node version: 20.x or higher

**Just click "Deploy [your-site-name]"** - but WAIT! You need to add environment variables first.

### 2.4 Add Environment Variables (IMPORTANT!)

**Before deploying**, click **"Add environment variables"** or go to:
**Site settings** → **Environment variables** → **Add a variable**

Add these required variables:

#### Required for Core Functionality:

| Variable Name | Where to Get It | Example |
|--------------|-----------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API | `eyJhbGc...` |

#### Optional but Recommended:

| Variable Name | Where to Get It | Purpose |
|--------------|-----------------|---------|
| `RESEND_API_KEY` | https://resend.com/api-keys | Email notifications |
| `NEXT_PUBLIC_SITE_URL` | After first deploy | `https://your-site.netlify.app` |

**To add each variable:**
1. Click "Add variable"
2. Select scope: "All deploys" or "Production only"
3. Key: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
4. Value: Your actual value
5. Click "Create variable"

### 2.5 Deploy!

1. After adding environment variables, click **"Deploy [your-site-name]"**
2. Netlify will start building your site
3. Wait 2-5 minutes for the build to complete

**You can watch the build logs:**
- Click on the deployment in progress
- View "Deploy log" to see real-time progress

---

## Step 3: Verify Deployment

### 3.1 Check Your Live Site

Once deployed, Netlify will give you a URL like:
```
https://your-site-name-abc123.netlify.app
```

**Test these features:**
- ✅ Homepage loads
- ✅ User registration works
- ✅ Login/logout works
- ✅ Create a gift table
- ✅ View and edit tables
- ✅ Admin panel (if you have admin access)

### 3.2 Verify Supabase Connection

1. Go to `/verificar-setup` on your live site
2. Check if Supabase connection is successful
3. If not, double-check your environment variables

---

## Step 4: Configure Custom Domain (Optional)

### 4.1 Set Up Custom Domain

1. In Netlify Dashboard, go to **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `mysite.com`)
4. Follow Netlify's instructions to configure DNS

### 4.2 Enable HTTPS

Netlify automatically provisions SSL certificates for custom domains:
- This happens automatically (may take a few minutes)
- Your site will be available at `https://yourdomain.com`

---

## Step 5: Update Site URL in Environment Variables

After deployment, update this variable:

1. Go to **Site settings** → **Environment variables**
2. Edit or add `NEXT_PUBLIC_SITE_URL`
3. Set value to your Netlify URL: `https://your-site-name.netlify.app`
4. **Important:** Redeploy after adding this variable

To redeploy:
- Go to **Deploys** tab
- Click **"Trigger deploy"** → **"Deploy site"**

---

## 🔧 Troubleshooting

### Build Failed?

**Check the deploy log for specific errors:**

1. **"Module not found" errors**
   - Usually auto-resolved by Netlify
   - Check if packages are in `package.json`

2. **Environment variable errors**
   - Make sure all required variables are added
   - Check for typos in variable names
   - Redeploy after adding variables

3. **Supabase connection errors**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
   - Check Supabase project is not paused

### Site loads but features don't work?

1. **Check browser console** for errors (F12 → Console)
2. **Verify environment variables** are set correctly
3. **Check Supabase RLS policies** (Row Level Security)
4. **Test API routes** in browser DevTools → Network tab

---

## 🔄 Making Updates

When you make changes to your code:

```bash
cd zepika-clone

# Make your changes to files

# Commit changes
git add .
git commit -m "Describe your changes"

# Push to GitHub
git push origin main
```

**Netlify will automatically:**
- Detect the push to GitHub
- Build your updated code
- Deploy the new version
- Your site updates in 2-5 minutes!

---

## 📊 Monitoring

### Netlify Dashboard Features:

1. **Analytics** - View site traffic and performance
2. **Deploy log** - Debug build issues
3. **Functions** - Monitor serverless functions
4. **Forms** - Track form submissions (if using Netlify Forms)
5. **Identity** - Manage users (if using Netlify Identity)

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Site is accessible at Netlify URL
- [ ] User registration works
- [ ] Login/logout works
- [ ] Can create gift tables
- [ ] Can view gift tables
- [ ] Can edit/delete own tables
- [ ] Shopping cart works
- [ ] Admin panel accessible (with admin account)
- [ ] Email notifications work (if configured)
- [ ] All images load correctly
- [ ] Mobile responsive design works

---

## 📝 Important Notes

### Environment Variables Safety
- **Never commit** `.env.local` or `.env` files to Git
- These are already in `.gitignore`
- Always add secrets via Netlify Dashboard

### Supabase Configuration
- Make sure RLS (Row Level Security) policies are set up
- Refer to `SUPABASE_SETUP.md` for database setup
- Check that anonymous access is properly configured

### Email Configuration
- Refer to `EMAIL_SETUP.md` for Resend setup
- Test email functionality in production
- Check spam folders if emails don't arrive

---

## 🆘 Need Help?

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: https://www.netlify.com/support
- **Same Support**: support@same.new
- **GitHub Issues**: Check your repository issues

---

## 🎯 Next Steps

After successful deployment:

1. **Test thoroughly** - Try all features
2. **Set up monitoring** - Use Netlify Analytics
3. **Configure alerts** - Get notified of failed deploys
4. **Plan updates** - Use Git for version control
5. **Backup database** - Regular Supabase backups

---

**Your deployment is ready! 🚀**

Just follow the steps above and your Zepika clone will be live in minutes!

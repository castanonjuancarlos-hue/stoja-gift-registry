# 📦 GoDaddy Upload Guide - Static Build

## ⚠️ CRITICAL WARNING - READ FIRST!

**This static build has SEVERE limitations:**

### ❌ What WILL NOT WORK:
- User registration/login
- Creating gift tables
- Viewing gift table details
- Editing tables
- Admin panel
- Database operations
- Dynamic URLs (`/mesa/123`)
- Email notifications
- Shopping cart checkout

### ✅ What MIGHT work (limited):
- Homepage display
- Static page layouts
- Basic navigation

**Your app will be essentially non-functional. See `STATIC_BUILD_WARNING.md` for details.**

---

## 📁 Files Ready

I've created a static build zip file:
- **File:** `godaddy-static-build.zip`
- **Location:** `/zepika-clone/godaddy-static-build.zip`
- **Size:** ~500KB-2MB
- **Contains:** Static HTML/CSS/JS files in `out/` folder

---

## 🚀 Step-by-Step Upload to GoDaddy

### Step 1: Download the Build Files

1. **In Same:** Click the project name at top left
2. **Select:** "Download" from dropdown
3. **Extract:** The downloaded ZIP file
4. **Find:** The `godaddy-static-build.zip` file inside
5. **Extract:** `godaddy-static-build.zip` to get the `out` folder

---

### Step 2: Access GoDaddy File Manager

#### Option A: Using GoDaddy File Manager (Web Interface)

1. **Log in** to GoDaddy: https://www.godaddy.com
2. **Go to:** My Products → Web Hosting
3. **Click:** "Manage" next to your hosting plan
4. **Find:** "Files" section
5. **Click:** "File Manager"
6. **Wait** for File Manager to load

#### Option B: Using FTP (Recommended for Faster Upload)

1. **Get FTP credentials:**
   - In GoDaddy: Hosting → Settings → FTP
   - Note: Hostname, Username, Password

2. **Download FTP client:**
   - FileZilla (free): https://filezilla-project.org
   - Or use any FTP client

3. **Connect to your server:**
   - Host: Your FTP hostname (e.g., `ftp.yourdomain.com`)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (or 22 for SFTP)

---

### Step 3: Clear Existing Files (If Any)

**Before uploading, clear your public_html directory:**

1. **Navigate to:** `public_html` folder (or `www` or `httpdocs`)
2. **Select all files** in that directory
3. **Delete** everything (or move to backup folder)
4. **Keep:** Only `.htaccess` if it exists (backup first)

**⚠️ Important:** Make sure you're in the root web directory!

---

### Step 4: Upload the Static Files

#### Using File Manager:

1. **Navigate to:** `public_html` directory
2. **Click:** "Upload" button
3. **Drag and drop** OR **select files**:
   - Upload ALL contents of the `out` folder
   - **NOT the `out` folder itself!**
   - Upload everything inside: `index.html`, `_next` folder, `admin` folder, etc.
4. **Wait** for upload to complete (may take 2-10 minutes)

#### Using FileZilla (FTP):

1. **Local site (left pane):** Navigate to your `out` folder
2. **Remote site (right pane):** Navigate to `public_html`
3. **Select all files** inside the `out` folder
4. **Right-click → Upload**
5. **Wait** for upload to complete

---

### Step 5: Configure .htaccess (Important for Routing)

**Create a `.htaccess` file** in your `public_html` directory with this content:

```apache
# Enable rewrite engine
RewriteEngine On

# Redirect all requests to index.html for client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/_next/
RewriteRule ^(.*)$ /index.html [L]

# Add trailing slash
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !/$
RewriteRule ^(.*)$ /$1/ [L,R=301]

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

**How to create .htaccess:**

**In File Manager:**
1. Click "New File"
2. Name it `.htaccess` (with the dot at the beginning)
3. Right-click → Edit
4. Paste the content above
5. Save

**In FileZilla:**
1. Create `.htaccess` locally with the content above
2. Upload to `public_html`

---

### Step 6: Set File Permissions

**Make sure files are readable:**

1. **Select all uploaded files**
2. **Right-click → Permissions** (or Change Permissions)
3. **Set:**
   - Files: `644` (rw-r--r--)
   - Folders: `755` (rwxr-xr-x)
4. **Check:** "Apply to directories recursively"
5. **Click:** OK

---

### Step 7: Test Your Site

1. **Visit your domain:** `http://yourdomain.com`
2. **You should see:** Your Stoja homepage

**Test these URLs:**
- `http://yourdomain.com/` - Homepage ✓
- `http://yourdomain.com/login/` - Login page ✓
- `http://yourdomain.com/registro/` - Register page ✓
- `http://yourdomain.com/planes/` - Plans page ✓

---

## 🔧 Troubleshooting

### "404 Not Found" Errors

**Problem:** Pages show 404 errors

**Solution:**
1. Verify `.htaccess` file exists and has correct content
2. Check that all files are in `public_html` (not in a subfolder)
3. Ensure mod_rewrite is enabled (contact GoDaddy support if needed)

---

### "403 Forbidden" Errors

**Problem:** Can't access the site

**Solution:**
1. Check file permissions (should be 644 for files, 755 for directories)
2. Ensure `index.html` exists in root directory
3. Check that there's no IP blocking in .htaccess

---

### "Blank White Page"

**Problem:** Site loads but shows blank page

**Solution:**
1. **Open browser console** (F12 → Console tab)
2. **Check for errors** - likely JavaScript errors
3. **Possible cause:** Environment variables not set
4. **Note:** Supabase features won't work without server

---

### Links Don't Work / Pages Not Found

**Problem:** Navigation doesn't work

**Solution:**
1. Verify `.htaccess` rewrite rules are correct
2. Contact GoDaddy to enable `mod_rewrite` if not working
3. Some client-side routing may not work on static hosting

---

### Authentication Doesn't Work

**Problem:** Can't log in or register

**Expected:** This is normal! Authentication requires a server and doesn't work in static builds. See warning at top of this document.

---

### Creating Tables Doesn't Work

**Problem:** Can't create or view gift tables

**Expected:** This is normal! Database operations require a server. Static builds cannot perform these functions.

---

## 📂 File Structure on GoDaddy

After upload, your `public_html` should look like:

```
public_html/
├── .htaccess
├── index.html
├── 404.html
├── _next/
│   ├── static/
│   │   ├── chunks/
│   │   ├── css/
│   │   └── media/
├── admin/
│   ├── index.html
│   ├── products/
│   ├── users/
│   └── ...
├── login/
│   └── index.html
├── registro/
│   └── index.html
├── planes/
│   └── index.html
└── ... (other pages)
```

---

## 🌐 DNS & Domain Configuration

If your domain isn't pointing to GoDaddy hosting:

1. **Go to:** GoDaddy → My Products → Domains
2. **Click:** Manage DNS
3. **Ensure A record** points to your hosting IP
4. **Wait:** 24-48 hours for DNS propagation

---

## 🔐 SSL Certificate (HTTPS)

To enable HTTPS on GoDaddy:

1. **In GoDaddy:** Go to your hosting plan
2. **Find:** SSL Certificates section
3. **Purchase or enable free SSL**
4. **Wait:** 15-30 minutes for activation
5. **Your site** will be available at `https://yourdomain.com`

---

## 📊 What to Expect After Upload

### ✅ Will Work:
- Homepage displays
- Static pages load
- Basic navigation
- Visual appearance
- CSS styling

### ❌ Won't Work:
- User login/registration
- Creating gift tables
- Viewing specific tables
- Admin functionality
- Database operations
- Email notifications
- Dynamic content
- Real-time updates

**Your app will look correct but won't function for its intended purpose.**

---

## 💡 Recommended Next Steps

**After seeing the limitations, I strongly recommend:**

1. **Deploy to Netlify instead** (free, 5 minutes, all features work)
2. **Keep your GoDaddy domain** and point it to Netlify
3. **See:** `NETLIFY_DEPLOYMENT_STEPS.md` for full guide

**Benefits:**
- ✅ FREE hosting
- ✅ ALL features work
- ✅ Better performance
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Use your GoDaddy domain

---

## 📞 Need Help?

- **GoDaddy Support:** https://www.godaddy.com/help
- **File Manager Guide:** https://www.godaddy.com/help/use-the-file-manager-6675
- **FTP Setup:** https://www.godaddy.com/help/find-my-ftp-username-and-password-1357

---

## ⚠️ Final Reminder

**This static build is NOT a proper deployment of your Next.js app.**

Most features will not work because:
- No server-side rendering
- No API routes
- No database connectivity
- No authentication system

**For a fully functional app, use Netlify (free) or a Node.js hosting provider.**

---

**Files created:**
- ✅ `godaddy-static-build.zip` - Ready to upload
- ✅ This guide - Upload instructions
- ✅ `.htaccess` template - Included in instructions

**Good luck! But seriously, consider Netlify instead. 😊**

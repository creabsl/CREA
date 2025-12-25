# CREA Deployment Guide

## Your Setup

- **Frontend**: Cloudflare Pages (crea.org.in) - connected to GitHub
- **Backend**: VPS on Hostinger (api.crea.org.in)
- **Database**: MongoDB Atlas

## Recent Fixes Applied

### 1. Backend CORS Configuration

✅ Fixed CORS to allow requests from `https://crea.org.in`
✅ Added proper OPTIONS preflight handling
✅ Defensive CORS headers for all responses

### 2. Frontend API URL Normalization

✅ Prevented double `/api/api/...` URLs
✅ Normalized all API_URL constants to strip trailing slashes

---

## Backend Deployment (VPS Hostinger)

### Step 1: Upload Changes to VPS

```bash
# SSH into your VPS
ssh your-user@your-vps-ip

# Navigate to backend directory
cd /path/to/backend

# Pull latest changes or upload modified files
# Make sure these files are updated:
# - server.js (CORS fixes)
# - .env (CLIENT_URL added)
```

### Step 2: Restart Backend Server

```bash
# If using PM2
pm2 restart all
# or specific app
pm2 restart crea-backend

# If using systemd
sudo systemctl restart crea-backend

# If running manually (not recommended for production)
npm start
```

### Step 3: Verify Backend

```bash
# Test health endpoint
curl https://api.crea.org.in/health

# Test CORS preflight from your frontend domain
curl -i -X OPTIONS https://api.crea.org.in/api/stats/summary \
  -H "Origin: https://crea.org.in" \
  -H "Access-Control-Request-Method: GET"

# Expected: Should see "Access-Control-Allow-Origin: https://crea.org.in"
```

---

## Frontend Deployment (Cloudflare Pages)

### Step 1: Set Environment Variable in Cloudflare

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://api.crea.org.in`
   - **Important**: Do NOT include `/api` at the end
5. Save

### Step 2: Push Changes to GitHub

```bash
# From your local Frontend directory
cd Frontend

# Stage all changes
git add src/services/api.ts src/pages/*.tsx

# Commit
git commit -m "Fix CORS and normalize API URLs"

# Push to trigger Cloudflare rebuild
git push origin main
```

### Step 3: Monitor Cloudflare Build

- Cloudflare Pages will automatically detect the push and rebuild
- Check build logs in Cloudflare dashboard
- Usually takes 1-3 minutes

---

## Testing After Deployment

### 1. Open Browser DevTools

- Open https://crea.org.in
- Press `F12` to open DevTools
- Go to **Console** tab

### 2. Check for Errors

✅ **No more CORS errors** (Access-Control-Allow-Origin)
✅ **No more `/api/api/...` URLs** in Network tab
✅ **API calls succeed** (check Network tab for 200 responses)

### 3. Test Key Features

- [ ] Login/Register
- [ ] View stats/summary on homepage
- [ ] Forum topics load
- [ ] Events display
- [ ] Documents accessible

---

## Quick Fixes If Issues Persist

### If CORS errors still appear:

1. **Check backend logs** on VPS:

```bash
# View logs
pm2 logs crea-backend
# or
journalctl -u crea-backend -f
```

Look for: `CORS blocked origin:` messages

2. **Verify allowed origins** in backend:

```bash
grep -A 10 "allowedOrigins" /path/to/backend/server.js
```

Should include `https://crea.org.in`

3. **Clear Cloudflare cache**:
   - Cloudflare dashboard → Caching → Purge Everything

### If double `/api` URLs persist:

1. **Check VITE_API_URL** in Cloudflare:

   - Should be: `https://api.crea.org.in`
   - NOT: `https://api.crea.org.in/api`

2. **Verify build used the env variable**:
   - In Cloudflare Pages build logs, search for `VITE_API_URL`

---

## Production Checklist

Backend (.env):

- [x] `CLIENT_URL=https://crea.org.in`
- [x] `MONGO_URI` configured
- [x] `JWT_SECRET` set
- [x] `PORT=5000` (or your VPS port)

Frontend (Cloudflare):

- [ ] `VITE_API_URL=https://api.crea.org.in` set in environment variables
- [ ] Latest code pushed to GitHub
- [ ] Build successful
- [ ] Domain connected (crea.org.in)

Backend Server:

- [ ] PM2/systemd running backend
- [ ] Port 5000 accessible (or proxied via nginx)
- [ ] SSL certificate active for api.crea.org.in
- [ ] Firewall allows HTTPS traffic

---

## Rollback Plan (If Needed)

### Backend:

```bash
# Revert to previous version
pm2 stop crea-backend
git checkout HEAD~1 server.js
pm2 start crea-backend
```

### Frontend:

- Cloudflare → Deployments → Click "Rollback" on previous successful deployment

---

## Support Commands

### Check backend is running:

```bash
pm2 status
# or
ps aux | grep node
```

### View backend logs:

```bash
pm2 logs --lines 100
```

### Test API endpoint:

```bash
curl -v https://api.crea.org.in/api/stats/summary
```

### Check DNS:

```bash
nslookup api.crea.org.in
nslookup crea.org.in
```

---

## Notes

- Backend changes require server restart
- Frontend changes auto-deploy via GitHub push → Cloudflare Pages
- Always test in incognito/private window after deployment to avoid cache issues

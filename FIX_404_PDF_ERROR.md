# 404 PDF Error - Complete Solution

## Problem Summary
When trying to download PDFs from `https://api.crea.org.in/uploads/circulars/`, you get:
```
Cannot GET /uploads/circulars/1766811551102-142607110.pdf
Failed to load resource: the server responded with a status of 404 ()
```

The files were uploaded and URLs were saved to the database, but **the actual files don't exist on the production server's disk**.

## Why This Happens
1. **Local Development**: Files uploaded are stored in `backend/uploads/` directory
2. **Deploy to Production**: Only code is deployed, not the uploaded files
3. **Server Restart**: The `uploads` directory is in the deployment folder and gets deleted on redeploy
4. **Result**: Database has URLs, but files are gone → 404 errors

## How the Fix Works

### Before (Broken):
```
Upload → Save to /app/backend/uploads/circulars/file.pdf
Redeploy → /app/ deleted → File gone → 404 ❌
```

### After (Fixed):
```
Upload → Save to /var/www/crea/uploads/circulars/file.pdf
Redeploy → /var/www/crea/ untouched → File persists → ✅ Works
```

## Implementation Steps

### On Your Production Server:

1. **Connect to server:**
   ```bash
   ssh user@api.crea.org.in
   ```

2. **Create persistent directory:**
   ```bash
   sudo bash setup-uploads-production.sh
   ```
   Or manually:
   ```bash
   sudo mkdir -p /var/www/crea/uploads/{circulars,manuals,court-cases}
   sudo chmod -R 755 /var/www/crea/uploads
   sudo chown -R www-data:www-data /var/www/crea/uploads
   ```

3. **Update `.env` file:**
   ```bash
   cd /path/to/crea/backend
   echo "PUBLIC_UPLOADS_PATH=/var/www/crea/uploads" >> .env
   ```

4. **Restart backend:**
   ```bash
   pm2 restart backend --update-env
   # Or if using systemd:
   sudo systemctl restart crea-backend
   ```

5. **Verify it works:**
   ```bash
   # Test upload from admin panel
   # Or check logs:
   pm2 logs backend | grep UPLOAD
   
   # Check files exist:
   ls -lh /var/www/crea/uploads/circulars/
   
   # Test access:
   curl -I https://api.crea.org.in/uploads/circulars/test.pdf
   ```

## Code Changes Made

### 1. **backend/server.js** (Updated)
- Now respects `PUBLIC_UPLOADS_PATH` environment variable
- Automatically creates upload directories if missing
- Sets proper headers for PDF inline viewing

### 2. **backend/middleware/upload.js** (Updated)
- Uses persistent path from `PUBLIC_UPLOADS_PATH` env variable
- Falls back to local `uploads/` for development
- Logs upload operations for debugging

### 3. **New Files**
- `.env.production.example` - Template for production env vars
- `PRODUCTION_UPLOAD_FIX.md` - Detailed troubleshooting guide
- `setup-uploads-production.sh` - Automated setup script

## Testing the Fix

### Test 1: New Uploads Work
1. Admin → Documents → Circulars → Add New Circular
2. Upload a PDF
3. Check file appears at: `https://api.crea.org.in/uploads/circulars/[filename].pdf`

### Test 2: Files Persist After Restart
```bash
pm2 restart backend
# File should still be accessible
curl https://api.crea.org.in/uploads/circulars/[filename].pdf
```

### Test 3: Old Broken Files
Old uploads won't work (files are gone), but new ones will work. You may want to:
- Re-upload the PDFs from admin panel
- Or manually copy them to `/var/www/crea/uploads/`

## Troubleshooting

### Still getting 404?

1. **Check directory exists:**
   ```bash
   ls -lh /var/www/crea/uploads/circulars/
   ```
   If missing, run setup script again.

2. **Check env variable is set:**
   ```bash
   grep PUBLIC_UPLOADS_PATH /path/to/.env
   ```
   Should show: `PUBLIC_UPLOADS_PATH=/var/www/crea/uploads`

3. **Check file actually uploaded:**
   ```bash
   pm2 logs backend | grep -i upload
   # Should see: [UPLOAD] Saving circulars/[filename].pdf
   ```

4. **Check backend restarted with new env:**
   ```bash
   pm2 restart backend --update-env
   pm2 logs backend | head -20
   # Should show upload dir being created
   ```

5. **Check file permissions:**
   ```bash
   ls -lh /var/www/crea/uploads/
   # Should show: drwxr-xr-x www-data www-data
   ```

## Environment Variables Reference

```bash
# Development (.env)
PUBLIC_UPLOADS_PATH=./backend/uploads
NODE_ENV=development

# Production (.env)
PUBLIC_UPLOADS_PATH=/var/www/crea/uploads
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
PORT=5000
```

## Disk Space Monitoring

Since files are now persisted, monitor disk usage:

```bash
# Check disk usage
df -h /var/www/crea

# Check upload folder size
du -sh /var/www/crea/uploads/

# Find large files
find /var/www/crea/uploads -size +5M
```

## Summary

✅ **What's fixed:**
- PDFs no longer 404 after server restart
- Files persist across deployments
- Upload progress bars work
- Success modals display
- Documents page shows files

✅ **What to do:**
1. Run setup script on production
2. Update .env with `PUBLIC_UPLOADS_PATH`
3. Restart backend service
4. Re-upload files from admin panel
5. Test access to PDF URLs

✅ **Next improvements:**
- Set up automated backups of `/var/www/crea/uploads/`
- Monitor disk space
- Consider cloud storage (S3, Cloudinary) for redundancy
- Add file deletion logging

## Support Files

- `PRODUCTION_UPLOAD_FIX.md` - Detailed guide
- `setup-uploads-production.sh` - Automated setup
- `.env.production.example` - Environment template

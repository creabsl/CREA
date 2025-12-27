# Fix 404 Error for PDF Files in Production

## Error
```
Cannot GET /uploads/circulars/1766811551102-142607110.pdf
Failed to load resource: the server responded with a status of 404 ()
```

## Root Cause
Files uploaded locally are saved to `backend/uploads/` directory, but this directory is **not persisted** when the backend server restarts or redeploys in production. The file exists in the database but not on disk.

## Solution: Persistent Upload Directory

### Step 1: On Your Production Server, Create Persistent Directory

```bash
# SSH into your production server
ssh user@api.crea.org.in

# Create a persistent uploads directory outside the app folder
mkdir -p /var/www/crea/uploads/circulars
mkdir -p /var/www/crea/uploads/manuals
mkdir -p /var/www/crea/uploads/court-cases

# Set proper permissions
chmod -R 755 /var/www/crea/uploads
chown -R nobody:nogroup /var/www/crea/uploads  # or your web server user
```

### Step 2: Update Production Environment Variables

Edit `.env` on your production server:

```bash
# Add this line to specify the persistent uploads directory
PUBLIC_UPLOADS_PATH=/var/www/crea/uploads

# Rest of your environment variables...
MONGO_URI=...
JWT_SECRET=...
PORT=5000
```

### Step 3: Restart Backend Service

```bash
# If using PM2
pm2 restart backend --update-env

# If using systemd
systemctl restart crea-backend

# If running manually
npm start
```

### Step 4: Test File Upload

1. Go to Admin Panel → Documents → Add New Circular
2. Upload a PDF file
3. Copy the filename from the response (e.g., `1766811551102-142607110.pdf`)
4. Check if file exists on server:
   ```bash
   ls -lh /var/www/crea/uploads/circulars/1766811551102-142607110.pdf
   ```
5. Try accessing via browser:
   ```
   https://api.crea.org.in/uploads/circulars/1766811551102-142607110.pdf
   ```
   Should download the PDF, not show 404.

## Alternative Solutions

### Option A: Use Cloudinary (Recommended)
Cloudinary handles file hosting in the cloud:

```bash
npm install cloudinary multer-storage-cloudinary
```

Then update `backend/middleware/upload.js` to use Cloudinary instead of disk storage.

### Option B: Use AWS S3
```bash
npm install aws-sdk multer-s3
```

### Option C: Use Supabase Storage
```bash
npm install @supabase/storage-js
```

## Verify the Fix Works

### Test 1: Check Directory Persistence
```bash
# Restart backend
pm2 restart backend

# Files should still exist
ls -lh /var/www/crea/uploads/circulars/
```

### Test 2: Upload a New File
1. Admin → Documents → Circulars → Add New Circular
2. Upload a PDF file
3. Wait for success message
4. Check file exists:
   ```bash
   ls -lh /var/www/crea/uploads/circulars/ | tail -1
   ```

### Test 3: Access File via Browser
```
https://api.crea.org.in/uploads/circulars/[filename].pdf
```
Should download or preview the PDF, not return 404.

## Debugging

### If Still Getting 404:

```bash
# 1. Check if directory exists
ls -lh /var/www/crea/uploads/circulars/

# 2. Check environment variable is set
grep PUBLIC_UPLOADS_PATH /path/to/.env

# 3. Check backend logs for upload errors
pm2 logs backend | grep -i upload

# 4. Check file permissions
ls -lh /var/www/crea/uploads/

# 5. Verify backend is serving from correct path
curl -I https://api.crea.org.in/uploads/circulars/test.pdf
```

### Common Issues:

| Issue | Fix |
|-------|-----|
| `/var/www/crea` doesn't exist | `mkdir -p /var/www/crea/uploads/{circulars,manuals,court-cases}` |
| Permission denied | `chmod -R 755 /var/www/crea/uploads` |
| .env not updated | Add `PUBLIC_UPLOADS_PATH=/var/www/crea/uploads` |
| Backend not restarted | `pm2 restart backend --update-env` |
| Old files still 404 | Re-upload files, they'll go to new persistent location |

## Files Modified

1. **backend/server.js** - Updated to use `PUBLIC_UPLOADS_PATH` environment variable
2. **backend/middleware/upload.js** - Uses persistent uploads directory
3. **.env.production.example** - Template showing production setup

## Environment Variable Reference

```bash
# Development (local testing)
PUBLIC_UPLOADS_PATH=./backend/uploads

# Production (persistent storage)
PUBLIC_UPLOADS_PATH=/var/www/crea/uploads
```

## After Fix

✅ Files persist across server restarts  
✅ PDFs accessible via `https://api.crea.org.in/uploads/circulars/filename.pdf`  
✅ Upload progress bars work  
✅ Success modals display correctly  
✅ Documents page shows files properly  

## Next Steps

For a more robust solution, consider:
1. Set up automated backups of `/var/www/crea/uploads/`
2. Monitor disk space on production server
3. Implement file size limits (already done: 10MB max)
4. Add file deletion logging
5. Consider cloud storage for global CDN distribution

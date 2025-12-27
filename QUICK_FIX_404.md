# Quick Fix: 404 PDF Error

## 3-Step Solution

### Step 1: On Production Server
```bash
# SSH into production
ssh user@api.crea.org.in

# Create persistent uploads directory
sudo mkdir -p /var/www/crea/uploads/{circulars,manuals,court-cases}
sudo chmod -R 755 /var/www/crea/uploads
sudo chown -R www-data:www-data /var/www/crea/uploads
```

### Step 2: Update `.env`
```bash
# SSH into production server and edit .env
cd /path/to/crea/backend
nano .env

# Add this line:
PUBLIC_UPLOADS_PATH=/var/www/crea/uploads
```

### Step 3: Restart Backend
```bash
# Restart with new environment variables
pm2 restart backend --update-env

# Or if using systemd:
sudo systemctl restart crea-backend
```

## Verify It Works

```bash
# Check directory was created
ls -lh /var/www/crea/uploads/

# Test by uploading from Admin panel:
# Admin → Documents → Add New Circular → Upload PDF

# Check file exists
ls -lh /var/www/crea/uploads/circulars/

# Test access
curl -I https://api.crea.org.in/uploads/circulars/[filename].pdf
# Should return 200, not 404
```

## Error Messages & Fixes

| Problem | Solution |
|---------|----------|
| `Cannot GET /uploads/circulars/...` | Run Step 1-2-3 above |
| `Permission denied` | Use `sudo` or ensure www-data user owns directory |
| `No such file or directory` | Check path: `/var/www/crea/uploads/` exists |
| `Still getting 404 after restart` | Verify `PUBLIC_UPLOADS_PATH` in .env with: `grep PUBLIC_UPLOADS_PATH .env` |

## What Changed in Code

1. **backend/server.js** - Now checks `PUBLIC_UPLOADS_PATH` env var
2. **backend/middleware/upload.js** - Uses persistent directory path
3. New environment variables explained in `.env.production.example`

## Documentation

- **FIX_404_PDF_ERROR.md** - This file
- **PRODUCTION_UPLOAD_FIX.md** - Detailed troubleshooting
- **setup-uploads-production.sh** - Automated setup script
- **.env.production.example** - Environment template

---
**That's it!** Files will now persist and PDFs will be accessible after server restarts.

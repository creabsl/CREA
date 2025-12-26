# Cloudflare Pages Deployment Guide

## Frontend Deployment (Cloudflare Pages)

### 1. Environment Variables

Set these in Cloudflare Pages Dashboard → Settings → Environment Variables:

**Production Environment Variables:**

```
VITE_API_URL=https://api.crea.org.in
```

### 2. Build Settings

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `Frontend`

### 3. Deployment Steps

1. Push code to GitHub repository
2. Connect repository to Cloudflare Pages
3. Set environment variables in Cloudflare dashboard
4. Configure build settings
5. Deploy

## Backend Deployment (VPS)

The backend needs to be deployed on a VPS at `https://api.crea.org.in` to serve:

- API endpoints (`/api/*`)
- Uploaded files (`/uploads/*`)

### File Upload Paths

Ensure these directories exist on the backend server:

- `/uploads/circulars/`
- `/uploads/manuals/`
- `/uploads/court-cases/`

### CORS Configuration

The backend is configured to allow requests from:

- `https://crea.org.in`
- `https://www.crea.org.in`
- `*.pages.dev` (for preview deployments)

## Troubleshooting

### Files Not Loading (404 Error)

If you see errors like "Cannot GET /uploads/circulars/[filename].pdf":

1. **Check environment variable**: Ensure `VITE_API_URL` is set in Cloudflare Pages
2. **Verify backend**: Confirm backend server is running at `https://api.crea.org.in`
3. **Check file paths**: Ensure files exist in backend `/uploads/` directory
4. **CORS**: Verify backend CORS allows your frontend domain

### Environment Variable Not Working

- Environment variables must be set in Cloudflare Pages dashboard
- Rebuild and redeploy after setting environment variables
- Variables are baked into the build at build time

### Backend Server Requirements

- Node.js backend must be running and accessible at configured URL
- Static file serving must be enabled for `/uploads/` directory
- CORS must allow the frontend domain

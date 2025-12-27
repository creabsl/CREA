#!/bin/bash
# Production Upload Directory Setup Script
# Run this on your production server to set up persistent file storage

set -e

echo "=== CREA Upload Directory Setup ==="
echo ""

# Check if running as root (recommended)
if [ "$EUID" -ne 0 ]; then 
  echo "⚠ Warning: This script should be run as root for proper permissions"
  echo "  Run with: sudo bash setup-uploads.sh"
  echo ""
fi

# Create persistent uploads directory
UPLOAD_DIR="/var/www/crea/uploads"
echo "1. Creating persistent uploads directory..."
mkdir -p "$UPLOAD_DIR"/{circulars,manuals,court-cases}
echo "   ✓ Created: $UPLOAD_DIR"
echo "   ✓ Created: $UPLOAD_DIR/circulars"
echo "   ✓ Created: $UPLOAD_DIR/manuals"
echo "   ✓ Created: $UPLOAD_DIR/court-cases"
echo ""

# Set proper permissions
echo "2. Setting permissions..."
chmod -R 755 "$UPLOAD_DIR"
echo "   ✓ Permissions set to 755"

# Determine web server user
WEB_USER="www-data"
if ! id "$WEB_USER" &>/dev/null; then
  WEB_USER="nobody"
fi
if ! id "$WEB_USER" &>/dev/null; then
  WEB_USER="nginx"
fi

chown -R "$WEB_USER:$WEB_USER" "$UPLOAD_DIR"
echo "   ✓ Owner set to $WEB_USER"
echo ""

# Show directory structure
echo "3. Directory structure:"
ls -lh "$UPLOAD_DIR"
echo ""

# Provide .env update instructions
echo "4. Update your .env file:"
echo ""
echo "   Add this line:"
echo "   PUBLIC_UPLOADS_PATH=$UPLOAD_DIR"
echo ""

# Check if .env exists
if [ -f "/path/to/crea/backend/.env" ]; then
  echo "   Found .env at: /path/to/crea/backend/.env"
  if ! grep -q "PUBLIC_UPLOADS_PATH" /path/to/crea/backend/.env; then
    echo ""
    echo "   To add automatically:"
    echo "   echo 'PUBLIC_UPLOADS_PATH=$UPLOAD_DIR' >> /path/to/crea/backend/.env"
  fi
fi
echo ""

# Verify setup
echo "5. Verification:"
if [ -d "$UPLOAD_DIR/circulars" ] && [ -d "$UPLOAD_DIR/manuals" ] && [ -d "$UPLOAD_DIR/court-cases" ]; then
  echo "   ✓ All directories created"
else
  echo "   ✗ Some directories missing"
  exit 1
fi

if [ -w "$UPLOAD_DIR" ]; then
  echo "   ✓ Directory is writable"
else
  echo "   ✗ Directory is not writable"
  exit 1
fi
echo ""

# Final instructions
echo "=== SETUP COMPLETE ==="
echo ""
echo "Next steps:"
echo "1. Add to .env: PUBLIC_UPLOADS_PATH=$UPLOAD_DIR"
echo "2. Restart backend: pm2 restart backend --update-env"
echo "3. Test upload: Go to Admin → Documents → Add Circular"
echo "4. Verify: ls -lh $UPLOAD_DIR/circulars/"
echo ""
echo "Support:"
echo "• Check logs: pm2 logs backend | grep -i upload"
echo "• Check permissions: ls -lh $UPLOAD_DIR"
echo "• Test file access: curl -I https://api.crea.org.in/uploads/circulars/test.pdf"

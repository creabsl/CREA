# Data Cleanup Script

## Purpose

This script removes ALL dummy data from the database while preserving the admin account (`crearail5@gmail.com`).

## What Gets Deleted

- ❌ All users except `crearail5@gmail.com`
- ❌ All donations
- ❌ All memberships
- ❌ All forum topics and posts
- ❌ All events and event ads
- ❌ All notifications
- ❌ All suggestions
- ❌ All mutual transfers
- ❌ All body members
- ❌ All breaking news
- ❌ All advertisements
- ❌ All achievements
- ❌ All circulars
- ❌ All court cases
- ❌ All manuals
- ❌ All external links
- ❌ All OTPs

## What Gets Preserved

- ✅ Admin user: `crearail5@gmail.com`
- ✅ Settings (membership prices, etc.)

## How to Run

### Step 1: Backup First (IMPORTANT!)

```bash
# If you want to keep a backup, export the database first
mongodump --uri="your_mongodb_connection_string" --out=./backup_$(date +%Y%m%d)
```

### Step 2: Run the cleanup script

```bash
cd backend/scripts
node cleanupAllData.js
```

The script will:

1. Give you 5 seconds to cancel (press Ctrl+C)
2. Connect to the database
3. Delete all data except the admin
4. Show a summary of what was deleted
5. Verify the admin still exists

## Safety Features

- ✅ 5-second countdown before execution
- ✅ Preserves admin account automatically
- ✅ Verification step after cleanup
- ✅ Detailed logging of all operations
- ✅ Error handling

## Example Output

```
⚠️  WARNING: This will delete ALL data except the admin user!
⚠️  Admin email to preserve: crearail5@gmail.com
⚠️  Press Ctrl+C within 5 seconds to cancel...

🔌 Connecting to MongoDB...
✅ Connected to MongoDB

👥 Cleaning up Users...
   Deleted 150 users (preserved admin: crearail5@gmail.com)
💰 Cleaning up Donations...
   Deleted 45 donations
🎫 Cleaning up Memberships...
   Deleted 120 memberships
...

==================================================
✅ CLEANUP COMPLETED SUCCESSFULLY!
==================================================
📊 Total records deleted: 850
✅ Admin account preserved: crearail5@gmail.com
==================================================

✅ Verified: Admin user "Admin" (crearail5@gmail.com) still exists
   Role: admin
   Created: 2024-01-15T10:30:00.000Z
```

## Troubleshooting

### Admin user not found

If the script reports that the admin user doesn't exist, you need to create it first before running the cleanup.

### Connection errors

Make sure your `.env` file has the correct `MONGO_URI` setting.

### Permission denied

Make sure you're running the script from the `backend/scripts` directory.

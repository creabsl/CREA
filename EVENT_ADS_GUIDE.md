# Event Advertisements Guide

## Overview
The event advertisement system allows admins to manage multiple banner ads displayed on event gallery pages with dynamic user controls.

## Features

### 1. Multiple Ads Per Position
- **Left & Right Sidebars**: Admins can now add multiple advertisements to both left and right positions
- **Auto-Rotation**: Ads automatically rotate every 5 seconds
- **Priority System**: Ads display based on priority (higher priority first)
- **Visual Indicators**: Dots show which ad is currently displayed when multiple ads exist

### 2. User Dismissal
- **Close Button**: Users can dismiss ads they don't want to see
- **Persistent Storage**: Dismissed ads are saved in browser localStorage
- **Per-User Control**: Each user controls their own ad visibility
- **Hover Interaction**: Close button appears on hover for clean UI

### 3. Admin Management
- **Multi-Ad Interface**: View all ads per position in a list format
- **Priority Control**: Set priority values to control display order
- **Individual Controls**: Edit, enable/disable, or delete each ad independently
- **Status Badges**: Visual indicators for active/inactive status and priority level

## Admin Panel Usage

### Adding a New Ad
1. Navigate to Admin Panel → Event Ads tab
2. Click "+ Add Left Ad" or "+ Add Right Ad"
3. Fill in the form:
   - **Title**: Internal name for the ad
   - **Destination URL**: Where users go when clicking the ad
   - **Priority**: Higher numbers display first (default: 0)
   - **End Date**: Optional expiration date
   - **Image**: Upload ad image (recommended: 160x384 pixels)
4. Click "Create"

### Managing Existing Ads
- **Edit**: Modify any field including image and priority
- **Enable/Disable**: Toggle ad visibility without deleting
- **Delete**: Permanently remove an ad

### Best Practices
- Use priority levels (e.g., 10, 5, 0) to organize ad importance
- Higher priority = displays first in rotation
- Keep 2-4 ads per side for optimal rotation
- Monitor expiration dates to remove outdated ads
- Recommended image size: 160px × 384px

## Technical Details

### Database Schema
```javascript
{
  position: 'left' | 'right',  // Sidebar position
  title: String,                // Ad title/name
  imageUrl: String,            // Path to uploaded image
  link: String,                // Destination URL
  isActive: Boolean,           // Active status
  priority: Number,            // Display priority (higher = first)
  startDate: Date,             // When ad becomes active
  endDate: Date                // Optional expiration
}
```

### API Endpoints
- `GET /api/event-ads/active` - Get active ads (public)
- `GET /api/event-ads` - Get all ads (admin)
- `POST /api/event-ads` - Create/update ad (admin)
- `DELETE /api/event-ads/:id` - Delete ad (admin)
- `PATCH /api/event-ads/:id/toggle` - Toggle status (admin)

### Frontend Features
- **AdCarousel Component**: Handles multiple ads with auto-rotation
- **localStorage**: Tracks dismissed ads per user
- **Framer Motion**: Smooth transitions between ads
- **Responsive Design**: Hides on screens smaller than 1280px

## User Experience

### For Regular Users
- Ads appear on event gallery pages (completed events only)
- Smooth transitions between multiple ads
- Close button to dismiss unwanted ads
- Dismissed ads won't show again (per browser)

### For Admins
- Placeholder view when no ads exist
- Full management interface in admin panel
- Real-time status updates
- Bulk management of multiple ads per position

## Migration Notes
- Existing single ads will continue to work
- Remove unique constraint allows multiple ads per position
- Priority field added (defaults to 0)
- Backend automatically handles both single and multiple ad scenarios

# Sharing Feature Documentation

## Overview

The sharing feature allows users to create shareable links for their mood analysis and song suggestions. This enables users to share their musical mood discoveries with friends and on social media.

## How It Works

### Architecture

1. **Storage**: Uses JSONBin.io as external JSON storage service
2. **Sharing**: Creates public JSON bins with mood + songs data
3. **URLs**: Generates shareable URLs like `https://yourdomain.com/share/[id]`
4. **Display**: Read-only view of shared mood and playlist

### Data Structure

Each shared entry contains:

```json
{
  "mood": "User's original mood text",
  "moodAnalysis": {
    "mood": "analyzed_mood",
    "genres": ["genre1", "genre2"],
    "energy": 0.7,
    "valence": 0.8,
    "tempo": 120
  },
  "suggestions": {
    "tracks": [...]
  },
  "sharedBy": "User Name",
  "sharedAt": "2025-09-13T10:30:00.000Z",
  "appName": "MoodTunes",
}
```

## Setup

### 1. Get JSONBin.io API Key

1. Visit [jsonbin.io](https://jsonbin.io)
2. Create a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local`:
   ```bash
   JSONBIN_API_KEY=your_api_key_here
   ```

## Usage

### From Suggestions Page

- Users can click "Share This Mood" button
- Creates shareable link and copies to clipboard
- Shows toast notification with success/error

### From History Page

- Each history entry has a "Share" button
- Shares that specific mood analysis
- Prevents card click when sharing

### Shared Page View

- Clean, read-only display of mood and songs
- Spotify embed players for each track
- Option to copy link again or try the app

## API Endpoints

### POST /api/share

Creates a new shareable link

```javascript
// Request body
{
  "mood": "feeling energetic and happy",
  "moodAnalysis": {...},
  "suggestions": {...},
  "sharedBy": "John Doe"
}

// Response
{
  "success": true,
  "shareId": "abc123",
  "shareUrl": "https://yourdomain.com/share/abc123",
  "message": "Mood shared successfully!"
}
```

### GET /api/share?id=[shareId]

Retrieves shared mood data

```javascript
// Response
{
  "success": true,
  "data": {
    "mood": "...",
    "moodAnalysis": {...},
    "suggestions": {...},
    "sharedBy": "John Doe",
    "sharedAt": "2025-09-13T10:30:00.000Z"
  }
}
```

## Benefits

### For Users

- Share musical discoveries with friends
- Show mood-music connections
- Create social media content
- Save/bookmark favorite mood analyses

### For App

- Organic user acquisition through shares
- Social proof and engagement
- No database/storage costs
- Simple implementation

## Error Handling

- Invalid share IDs return 404
- Missing data returns appropriate error messages
- Network errors show user-friendly messages
- Fallback to app home page for errors

## Rate Limits

JSONBin.io free tier includes:

- 100,000 API requests per month
- Unlimited public bins
- No bandwidth limits for public bins

Perfect for moderate sharing usage without costs.

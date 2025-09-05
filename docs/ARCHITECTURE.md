# MoodTunes Architecture

This document provides a detailed overview of the MoodTunes application architecture, including the mood analysis engine, API design, and component structure.

## System Overview

MoodTunes is a Next.js 15 application that combines advanced mood analysis with Spotify's Web API to provide personalized music recommendations based on emotional state.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  Mood Analysis   │───▶│ Song Suggestions│
│                 │    │     Engine       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Sentiment Score  │    │  Spotify API    │
                       │ Keyword Matching │    │   Integration   │
                       │ Context Analysis │    │                 │
                       └──────────────────┘    └─────────────────┘
```

## Core Components

### 1. Mood Analysis Engine (`src/lib/mood-analyzer.js`)

The heart of the application, featuring:

#### Advanced Sentiment Analysis

- **Multi-layered approach**: Combines keyword detection, sentiment scoring, and contextual analysis
- **10 mood categories**: Happy, Sad, Energetic, Relaxed, Angry, Romantic, Nostalgic, Anxious, Confident, Thoughtful
- **Confidence scoring**: Provides reliability metrics for mood detection
- **Fallback system**: Handles edge cases and ambiguous inputs

#### Key Features

```javascript
// Mood pattern structure
const MOOD_PATTERNS = {
  happy: {
    keywords: ['happy', 'joy', 'excited', ...],
    genres: ['pop', 'dance', 'funk', 'disco'],
    energy: 0.8,      // Musical energy level (0-1)
    valence: 0.9,     // Musical positivity (0-1)
    tempo: { min: 120, max: 140 }  // BPM range
  }
}
```

#### Analysis Pipeline

1. **Text Preprocessing**: Sanitization and normalization
2. **Keyword Matching**: Pattern-based mood detection
3. **Sentiment Analysis**: Positive/negative/neutral scoring
4. **Context Analysis**: Temporal, intensity, and linguistic features
5. **Confidence Calculation**: Multi-factor reliability scoring
6. **Musical Mapping**: Convert emotions to musical parameters

### 2. Spotify API Integration (`src/lib/spotify-api.js`)

#### Features

- **Client Credentials Flow**: Server-to-server authentication
- **Token Caching**: Automatic token refresh and caching
- **Error Handling**: Comprehensive error handling with fallbacks
- **Rate Limiting**: Built-in request throttling
- **Timeout Protection**: 5-second request timeouts

#### API Client Structure

```javascript
class SpotifyAPIClient {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    /* Token management */
  }
  async makeRequest(endpoint, options) {
    /* HTTP client */
  }
  async searchTracks(query, options) {
    /* Search implementation */
  }
}
```

### 3. API Routes

#### `/api/analyze-mood`

- **Input**: User mood text (3-500 characters)
- **Processing**: Advanced mood analysis pipeline
- **Output**: Mood category, confidence, musical parameters, analysis details

#### `/api/suggest-songs`

- **Input**: Mood analysis results
- **Processing**: Multi-genre Spotify search with deduplication
- **Output**: Curated song list with metadata

### 4. Frontend Architecture

#### Component Hierarchy

```
App Layout (src/app/layout.js)
├── Theme Provider (Dark/Light mode)
├── Navbar (Navigation)
├── Main Content
│   ├── Home Page (Mood input)
│   ├── Suggestions Page (Song display)
│   └── History Pages (Past moods)
└── Footer
```

#### State Management

- **Session Storage**: Temporary mood data during user session
- **Local Storage**: Persistent mood history (last 3 entries)
- **React State**: Component-level state management
- **No external state library**: Keeps bundle size minimal

## Data Flow

### 1. User Journey

```
User Input → Mood Analysis → Song Generation → Display Results → Save History
```

### 2. API Request Flow

```javascript
// 1. Mood Analysis Request
POST /api/analyze-mood
{
  "moodText": "I'm feeling happy today!"
}

// 2. Analysis Response
{
  "success": true,
  "data": {
    "mood": "happy",
    "confidence": 0.85,
    "genres": ["pop", "dance"],
    "energy": 0.8,
    "valence": 0.9
  }
}

// 3. Song Suggestions Request
POST /api/suggest-songs
{
  "mood": "happy",
  "genres": ["pop", "dance"]
}

// 4. Suggestions Response
{
  "success": true,
  "suggestions": {
    "tracks": [/* song array */],
    "totalTracks": 15
  }
}
```

## Performance Considerations

### 1. Client-Side Optimizations

- **Turbopack**: Fast development builds and hot reloading
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component for album art
- **Lazy Loading**: Components loaded on demand

### 2. Server-Side Optimizations

- **Token Caching**: Reduces Spotify API calls
- **Request Deduplication**: Prevents duplicate API requests
- **Error Boundaries**: Graceful error handling
- **Fallback Responses**: Sample data when APIs are unavailable

### 3. Animation Performance

- **Hardware Acceleration**: CSS transforms and opacity
- **60fps Target**: Optimized particle system
- **Reduced Motion**: Respects user accessibility preferences
- **Memory Management**: Proper cleanup of animation frames

## Security Considerations

### 1. API Security

- **Environment Variables**: Sensitive credentials stored securely
- **Input Validation**: Comprehensive sanitization and validation
- **Rate Limiting**: Built-in protection against abuse
- **Error Handling**: No sensitive information in error messages

### 2. Client Security

- **XSS Protection**: Input sanitization prevents script injection
- **CSRF Protection**: Next.js built-in CSRF protection
- **Content Security Policy**: Restricts resource loading
- **Secure Headers**: Security headers for production deployment

## Scalability

### 1. Current Architecture

- **Stateless Design**: No server-side session storage
- **Client-Side Caching**: Reduces server load
- **Efficient Algorithms**: O(n) complexity for mood analysis
- **Minimal Dependencies**: Keeps bundle size small

### 2. Future Enhancements

- **Redis Caching**: For high-traffic scenarios
- **CDN Integration**: For static asset delivery
- **Database Integration**: For user accounts and preferences
- **Microservices**: Separate mood analysis service

## Error Handling Strategy

### 1. Graceful Degradation

- **Fallback Responses**: Sample data when APIs fail
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Error Boundaries**: Prevent application crashes
- **User Feedback**: Clear error messages and recovery options

### 2. Monitoring and Logging

- **Request IDs**: Unique identifiers for debugging
- **Performance Metrics**: Processing time tracking
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Usage patterns and success rates

## Testing Strategy

### 1. Built-in Testing

- **Input Validation**: Comprehensive edge case handling
- **API Error Simulation**: Fallback system testing
- **Accessibility Testing**: Screen reader and keyboard support
- **Performance Testing**: Animation and API response times

### 2. Manual Testing Procedures

- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Desktop, tablet, mobile responsiveness
- **Accessibility Testing**: Screen readers, keyboard navigation
- **Performance Testing**: Network throttling, slow devices

## Deployment Architecture

### 1. Recommended Platforms

- **Vercel**: Optimal for Next.js applications
- **Netlify**: Alternative with good performance
- **AWS/GCP/Azure**: For enterprise deployments

### 2. Environment Configuration

```env
# Production Environment Variables
SPOTIFY_CLIENT_ID=production_client_id
SPOTIFY_CLIENT_SECRET=production_client_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Build Optimization

```bash
# Production build with optimizations
pnpm build

# Static export (if needed)
pnpm export
```

This architecture provides a solid foundation for a scalable, maintainable, and performant mood-based music recommendation system.

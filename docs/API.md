# API Documentation

This document describes the API endpoints available in the Mood Music application.

## Base URL

```
http://localhost:3000/api  (Development)
https://your-domain.com/api  (Production)
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Rate Limiting

- **Mood Analysis**: 60 requests per minute per IP
- **Song Suggestions**: 30 requests per minute per IP

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "retryable": true|false
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input parameters
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVICE_UNAVAILABLE`: External service (Spotify) unavailable
- `INTERNAL_ERROR`: Server error
- `NOT_FOUND`: Resource not found

## Endpoints

### 1. Analyze Mood

Analyzes user mood text and returns music characteristics.

**Endpoint:** `POST /api/analyze-mood`

**Request Body:**

```json
{
  "moodText": "I'm feeling happy and energetic today!"
}
```

**Parameters:**

- `moodText` (string, required): User's mood description (3-500 characters)

**Response:**

```json
{
  "success": true,
  "data": {
    "mood": "happy",
    "confidence": 0.85,
    "genres": ["pop", "dance", "electronic"],
    "energy": 0.8,
    "valence": 0.9,
    "tempo": {
      "min": 120,
      "max": 140
    },
    "backgroundTheme": {
      "colors": {
        "primary": "#FFD700",
        "secondary": "#FF6B6B",
        "accent": "#4ECDC4"
      },
      "animation": {
        "type": "particles",
        "speed": "fast",
        "intensity": 0.8
      }
    },
    "sentimentScore": 2.5,
    "sentimentComparative": 0.5
  }
}
```

**Response Fields:**

- `mood`: Detected mood category (happy, sad, energetic, calm, anxious, romantic, nostalgic, angry)
- `confidence`: Confidence score (0.0-1.0)
- `genres`: Array of recommended music genres
- `energy`: Energy level (0.0-1.0)
- `valence`: Musical positivity (0.0-1.0)
- `tempo`: Recommended tempo range (BPM)
- `backgroundTheme`: Visual theme configuration
- `sentimentScore`: Raw sentiment analysis score
- `sentimentComparative`: Comparative sentiment score

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "I feel amazing and full of energy!"}'
```

### 2. Generate Song Suggestions

Creates song suggestions based on mood analysis results.

**Endpoint:** `POST /api/suggest-songs`

**Request Body:**

```json
{
  "mood": "happy",
  "genres": ["pop", "dance"],
  "energy": 0.8,
  "valence": 0.9,
  "tempo": {
    "min": 120,
    "max": 140
  },
  "moodText": "I'm feeling happy and energetic today!"
}
```

**Parameters:**

- `mood` (string, required): Mood category
- `genres` (array, required): Array of genre strings
- `energy` (number, required): Energy level (0.0-1.0)
- `valence` (number, required): Musical positivity (0.0-1.0)
- `tempo` (object, required): Tempo range with min/max values
- `moodText` (string, required): Original mood description

**Response:**

```json
{
  "success": true,
  "suggestions": {
    "tracks": [
      {
        "id": "4iV5W9uYEdYUVa79Axb7Rh",
        "name": "Happy",
        "artists": ["Pharrell Williams"],
        "preview_url": "https://p.scdn.co/mp3-preview/...",
        "external_urls": {
          "spotify": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
        }
      }
    ],
    ],
    "totalTracks": 15,
    "mood": "happy",
    "moodAnalysis": {
      "energy": 0.8,
      "valence": 0.9,
      "genres": ["pop", "dance"]
    }
  }
}
```

**Response Fields:**

- `tracks`: Array of suggested track objects
- `totalTracks`: Number of suggested tracks
- `mood`: Detected mood category
- `moodAnalysis`: Analysis details including energy, valence, and genres

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/suggest-songs \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "happy",
    "genres": ["pop", "dance"],
    "energy": 0.8,
    "valence": 0.9,
    "tempo": {"min": 120, "max": 140},
    "moodText": "I feel happy!"
  }'
```

### 3. Error Handling

All endpoints return standardized error responses with the following format:

```json
{
  "success": false,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Invalid mood input provided",
    "code": "INVALID_INPUT",
    "retryable": false
  }
}
```

### 3. API Information

Get information about the mood analysis API.

**Endpoint:** `GET /api/analyze-mood`

**Response:**

```json
{
  "name": "Mood Analysis API",
  "version": "1.0.0",
  "description": "Analyzes mood text and returns music characteristics",
  "endpoints": {
    "POST": {
      "description": "Analyze mood text",
      "body": {
        "moodText": "string (3-500 characters)"
      },
      "response": {
        "mood": "string",
        "confidence": "number",
        "genres": "array",
        "energy": "number",
        "valence": "number",
        "tempo": "object"
      }
    }
  },
  "availableMoods": [
    "happy",
    "sad",
    "energetic",
    "calm",
    "anxious",
    "romantic",
    "nostalgic",
    "angry"
  ]
}
```

## Mood Categories

The API recognizes 8 primary mood categories:

### Happy

- **Genres**: pop, dance, electronic, funk
- **Energy**: 0.7-0.9
- **Valence**: 0.8-1.0
- **Tempo**: 120-140 BPM
- **Keywords**: happy, joyful, excited, cheerful, delighted

### Sad

- **Genres**: acoustic, folk, indie, blues
- **Energy**: 0.1-0.4
- **Valence**: 0.0-0.3
- **Tempo**: 60-90 BPM
- **Keywords**: sad, depressed, melancholy, down, heartbroken

### Energetic

- **Genres**: electronic, rock, dance, hip-hop
- **Energy**: 0.8-1.0
- **Valence**: 0.6-0.9
- **Tempo**: 130-160 BPM
- **Keywords**: energetic, pumped, hyper, motivated, dynamic

### Calm

- **Genres**: ambient, chill, classical, new-age
- **Energy**: 0.0-0.3
- **Valence**: 0.5-0.8
- **Tempo**: 60-100 BPM
- **Keywords**: calm, peaceful, relaxed, serene, tranquil

### Anxious

- **Genres**: ambient, classical, acoustic, chill
- **Energy**: 0.2-0.5
- **Valence**: 0.3-0.6
- **Tempo**: 70-110 BPM
- **Keywords**: anxious, nervous, worried, stressed, tense

### Romantic

- **Genres**: r&b, soul, jazz, pop
- **Energy**: 0.3-0.7
- **Valence**: 0.6-0.9
- **Tempo**: 80-120 BPM
- **Keywords**: romantic, loving, passionate, intimate, tender

### Nostalgic

- **Genres**: classic rock, oldies, folk, indie
- **Energy**: 0.3-0.6
- **Valence**: 0.4-0.7
- **Tempo**: 90-130 BPM
- **Keywords**: nostalgic, reminiscent, wistful, longing, memories

### Angry

- **Genres**: rock, metal, punk, hardcore
- **Energy**: 0.7-1.0
- **Valence**: 0.0-0.4
- **Tempo**: 120-180 BPM
- **Keywords**: angry, furious, mad, irritated, frustrated

## Error Examples

### Validation Error

```json
{
  "success": false,
  "error": "Invalid input",
  "code": "VALIDATION_ERROR",
  "message": "Mood description must be at least 3 characters long",
  "retryable": false
}
```

### Rate Limit Error

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again later.",
  "retryable": true,
  "retryAfter": 60
}
```

### Service Unavailable

```json
{
  "success": false,
  "error": "Music service temporarily unavailable",
  "code": "SERVICE_UNAVAILABLE",
  "message": "Unable to connect to Spotify. Please try again later.",
  "retryable": true
}
```

### Not Found

```json
{
  "success": false,
  "error": "Song suggestions not found",
  "code": "SUGGESTIONS_NOT_FOUND",
  "message": "The requested song suggestions could not be found.",
  "retryable": false
}
```

## SDK Examples

### JavaScript/Node.js

```javascript
class MoodMusicAPI {
  constructor(baseUrl = "http://localhost:3000/api") {
    this.baseUrl = baseUrl;
  }

  async analyzeMood(moodText) {
    const response = await fetch(`${this.baseUrl}/analyze-mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moodText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async generateSuggestions(moodData) {
    const response = await fetch(`${this.baseUrl}/suggest-songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(moodData),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

// Usage
const api = new MoodMusicAPI();

try {
  const moodResult = await api.analyzeMood("I'm feeling great today!");
  const suggestions = await api.generateSuggestions({
    mood: moodResult.data.mood,
    genres: moodResult.data.genres,
    energy: moodResult.data.energy,
    valence: moodResult.data.valence,
    tempo: moodResult.data.tempo,
    moodText: "I'm feeling great today!",
  });

  console.log(
    "Generated suggestions:",
    suggestions.suggestions.totalTracks,
    "tracks"
  );
} catch (error) {
  console.error("API Error:", error.message);
}
```

### Python

```python
import requests
import json

class MoodMusicAPI:
    def __init__(self, base_url="http://localhost:3000/api"):
        self.base_url = base_url

    def analyze_mood(self, mood_text):
        response = requests.post(
            f"{self.base_url}/analyze-mood",
            json={"moodText": mood_text}
        )
        response.raise_for_status()
        return response.json()

    def generate_suggestions(self, mood_data):
        response = requests.post(
            f"{self.base_url}/suggest-songs",
            json=mood_data
        )
        response.raise_for_status()
        return response.json()



# Usage
api = MoodMusicAPI()

try:
    mood_result = api.analyze_mood("I'm feeling energetic and ready to dance!")
    suggestions = api.generate_suggestions({
        "mood": mood_result["data"]["mood"],
        "genres": mood_result["data"]["genres"],
        "energy": mood_result["data"]["energy"],
        "valence": mood_result["data"]["valence"],
        "tempo": mood_result["data"]["tempo"],
        "moodText": "I'm feeling energetic and ready to dance!"
    })

    print(f"Generated suggestions: {suggestions['suggestions']['totalTracks']} tracks")
except requests.exceptions.RequestException as e:
    print(f"API Error: {e}")
```

## Changelog

### v1.0.0 (Current)

- Initial API release
- Mood analysis endpoint
- Song suggestions endpoint

- 8 mood categories support

### Planned Features

- User authentication
- Suggestions history
- Custom mood categories

- GraphQL endpoint
- Batch processing

---

For more information, see the [main documentation](../README.md) or [setup guide](SETUP.md).

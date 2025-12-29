# MoodTunes API Documentation

This document provides comprehensive documentation for the MoodTunes API endpoints, including request/response formats, error handling, and usage examples.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Authentication

The MoodTunes API uses server-side Spotify authentication. No client-side authentication is required for end users.

## Endpoints

### 1. Analyze Mood

Analyzes user mood text and returns musical characteristics.

**Endpoint:** `POST /api/analyze-mood`

#### Request

```json
{
  "moodText": "string (required, 3-500 characters)"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "mood": "string",
    "confidence": "number (0.0-1.0)",
    "genres": ["string"],
    "energy": "number (0.0-1.0)",
    "valence": "number (0.0-1.0)",
    "tempo": {
      "min": "number",
      "max": "number"
    },
    "detectedKeywords": ["string"],
    "analysis": {
      "sentimentScore": {
        "positive": "number",
        "negative": "number",
        "neutral": "number",
        "overall": "number",
        "intensity": "number",
        "hasNegation": "boolean"
      },
      "contextFactors": {
        "temporal": {
          "past": "number",
          "present": "number",
          "future": "number"
        },
        "intensity": {
          "high": "number",
          "medium": "number",
          "low": "number"
        }
      },
      "linguisticFeatures": {
        "wordCount": "number",
        "sentenceCount": "number",
        "avgWordsPerSentence": "number",
        "hasExclamation": "boolean",
        "hasQuestion": "boolean",
        "hasEmoji": "boolean",
        "repetition": "number",
        "capsUsage": "number"
      },
      "sentences": "number",
      "complexity": {
        "avgWordLength": "number",
        "avgSentenceLength": "number",
        "complexity": "number"
      }
    }
  },
  "meta": {
    "requestId": "string",
    "processingTime": "number (milliseconds)",
    "analysisMethod": "string",
    "version": "string"
  }
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{
    "moodText": "I am feeling incredibly happy and energetic today! Ready to take on the world!"
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "mood": "happy",
    "confidence": 0.92,
    "genres": ["pop", "dance", "funk", "disco"],
    "energy": 0.85,
    "valence": 0.95,
    "tempo": {
      "min": 120,
      "max": 140
    },
    "detectedKeywords": ["happy", "energetic"],
    "analysis": {
      "sentimentScore": {
        "positive": 3.2,
        "negative": 0,
        "neutral": 0,
        "overall": 3.2,
        "intensity": 1.3,
        "hasNegation": false
      },
      "contextFactors": {
        "temporal": {
          "past": 0,
          "present": 1,
          "future": 0
        },
        "intensity": {
          "high": 1,
          "medium": 0,
          "low": 0
        }
      },
      "linguisticFeatures": {
        "wordCount": 14,
        "sentenceCount": 2,
        "avgWordsPerSentence": 7,
        "hasExclamation": true,
        "hasQuestion": false,
        "hasEmoji": false,
        "repetition": 0,
        "capsUsage": 0.07
      },
      "sentences": 2,
      "complexity": {
        "avgWordLength": 5.8,
        "avgSentenceLength": 7,
        "complexity": 6.4
      }
    }
  },
  "meta": {
    "requestId": "req_1704123456789_abc123",
    "processingTime": 42,
    "analysisMethod": "advanced_keyword_sentiment",
    "version": "4.0.0"
  }
}
```

### 2. Suggest Songs

Generates personalized song recommendations based on mood analysis.

**Endpoint:** `POST /api/suggest-songs`

#### Request

```json
{
  "mood": "string (required)",
  "genres": ["string (required, non-empty array)"],
  "moodText": "string (optional, original mood text)"
}
```

#### Response

```json
{
  "success": true,
  "suggestions": {
    "tracks": [
      {
        "id": "string",
        "name": "string",
        "artists": ["string"],
        "album": {
          "id": "string",
          "name": "string",
          "images": [
            {
              "url": "string",
              "height": "number",
              "width": "number"
            }
          ],
          "release_date": "string (YYYY-MM-DD)",
          "total_tracks": "number"
        },
        "external_urls": {
          "spotify": "string"
        },
        "duration_ms": "number",
        "popularity": "number (0-100)",
        "sourceGenre": "string",
        "preview_url": "string|null"
      }
    ],
    "totalTracks": "number",
    "seedGenres": ["string"],
    "mood": "string",
    "moodAnalysis": {
      "genres": ["string"]
    }
  },
  "meta": {
    "requestId": "string",
    "processingTime": "number (milliseconds)"
  }
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/api/suggest-songs \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "happy",
    "genres": ["pop", "dance"],
    "moodText": "I am feeling incredibly happy and energetic today!"
  }'
```

#### Example Response

```json
{
  "success": true,
  "suggestions": {
    "tracks": [
      {
        "id": "4iV5W9uYEdYUVa79Axb7Rh",
        "name": "Happy",
        "artists": ["Pharrell Williams"],
        "album": {
          "id": "4m2880jivSbbyEGAKfITCa",
          "name": "G I R L",
          "images": [
            {
              "url": "https://i.scdn.co/image/ab67616d0000b273e318ddb0e8f7c6e276e8b2c1",
              "height": 640,
              "width": 640
            }
          ],
          "release_date": "2014-03-03",
          "total_tracks": 10
        },
        "external_urls": {
          "spotify": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh"
        },
        "duration_ms": 232560,
        "popularity": 85,
        "sourceGenre": "pop",
        "preview_url": "https://p.scdn.co/mp3-preview/..."
      }
    ],
    "totalTracks": 15,
    "seedGenres": ["pop", "dance"],
    "mood": "I am feeling incredibly happy and energetic today!",
    "moodAnalysis": {
      "genres": ["pop", "dance", "funk"]
    }
  },
  "meta": {
    "requestId": "suggestions_1704123456789_xyz789",
    "processingTime": 1250
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "string",
    "code": "string"
  },
  "meta": {
    "timestamp": "string (ISO 8601)"
  }
}
```

### Common Error Codes

#### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "message": "Mood text is required",
    "code": "API_ERROR"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Common causes:**

- Missing required fields
- Invalid input format
- Text too short (< 3 characters) or too long (> 500 characters)

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "message": "We had trouble understanding your mood. Try rephrasing your description.",
    "code": "API_ERROR"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 503 Service Unavailable

```json
{
  "success": false,
  "error": {
    "message": "Music service is not available. Please check the server configuration.",
    "code": "API_ERROR"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Sharing API

### Create Share Link

**POST** `/api/share`

Creates a shareable link for mood analysis and song suggestions.

```javascript
// Request
{
  "mood": "I'm feeling absolutely amazing today!",
  "moodAnalysis": {
    "mood": "happy",
    "confidence": 0.85,
    "genres": ["pop", "dance", "funk"],
    "energy": 0.8,
    "valence": 0.9
  },
  "suggestions": {
    "tracks": [/* array of track objects */],
    "totalTracks": 15
  },
  "sharedBy": "John Doe"
}

// Response
{
  "success": true,
  "shareId": "64f8a9b2c1d2e3f4a5b6c7d8",
  "shareUrl": "https://moodtunes.app/share/64f8a9b2c1d2e3f4a5b6c7d8",
  "message": "Mood shared successfully!"
}
```

### Get Shared Mood

**GET** `/api/share?id={shareId}`

Retrieves shared mood data by ID.

```javascript
// Response
{
  "success": true,
  "data": {
    "mood": "I'm feeling absolutely amazing today!",
    "moodAnalysis": {
      "mood": "happy",
      "confidence": 0.85,
      "genres": ["pop", "dance", "funk"]
    },
    "suggestions": {
      "tracks": [/* array of track objects */]
    },
    "sharedBy": "John Doe",
    "sharedAt": "2024-01-15T10:30:00.000Z",
    "appName": "MoodTunes"
  }
}
```

## Rate Limiting & Performance

The API includes comprehensive performance optimizations:

- **Request Timeout**: 5 seconds for external API calls
- **Token Caching**: Spotify tokens cached for 1 hour to reduce API calls
- **Response Caching**: 30-minute caching for Spotify search results
- **Rate Limiting**: 100ms delays between Spotify requests
- **Retry Logic**: Exponential backoff for transient failures
- **Circuit Breakers**: Prevents cascade failures with automatic recovery
- **Fallback System**: Sample data when external services unavailable

## Mood Categories

The API recognizes 11 distinct mood categories with advanced analysis:

| Mood       | Energy | Valence | Tempo Range | Primary Genres                  | Keywords (Sample)                   |
| ---------- | ------ | ------- | ----------- | ------------------------------- | ----------------------------------- |
| happy      | 0.8    | 0.9     | 120-140 BPM | pop, dance, funk, disco         | happy, joy, excited, amazing, great |
| sad        | 0.3    | 0.2     | 60-90 BPM   | blues, indie, folk, alternative | sad, depressed, heartbroken, lonely |
| energetic  | 0.95   | 0.7     | 128-160 BPM | electronic, edm, techno, house  | energetic, pumped, motivated, hyper |
| relaxed    | 0.4    | 0.6     | 60-100 BPM  | ambient, chillout, lo-fi, jazz  | relaxed, calm, peaceful, tranquil   |
| angry      | 0.9    | 0.1     | 140-180 BPM | rock, metal, punk, hardcore     | angry, mad, furious, frustrated     |
| romantic   | 0.5    | 0.8     | 80-120 BPM  | r&b, soul, jazz, indie-pop      | love, romantic, crush, valentine    |
| nostalgic  | 0.5    | 0.6     | 90-130 BPM  | classic-rock, oldies, folk      | nostalgic, memories, past, vintage  |
| anxious    | 0.6    | 0.3     | 100-130 BPM | indie, alternative, ambient     | anxious, nervous, worried, stressed |
| confident  | 0.8    | 0.8     | 110-140 BPM | hip-hop, rap, trap, funk        | confident, bold, strong, powerful   |
| thoughtful | 0.4    | 0.5     | 70-110 BPM  | jazz, classical, post-rock      | thinking, philosophical, reflecting |
| chill      | 0.5    | 0.6     | 80-110 BPM  | lo-fi, chillhop, indie          | chill, laid-back, cool, whatever    |

### Advanced Analysis Features

- **200+ Keywords**: Comprehensive emotion vocabulary across all categories
- **Contextual Understanding**: Processes negation, intensity, and temporal context
- **Confidence Scoring**: 0.6-0.95 reliability range based on analysis quality
- **Multi-language Support**: Basic support for common emotions in multiple languages
- **Edge Case Handling**: Mixed emotions, contradictions, and poetic expressions
  | thoughtful | 0.4 | 0.5 | 70-110 BPM | jazz, classical, post-rock |

## Usage Examples

### JavaScript/TypeScript

```typescript
interface MoodAnalysisRequest {
  moodText: string;
}

interface MoodAnalysisResponse {
  success: boolean;
  data: {
    mood: string;
    confidence: number;
    genres: string[];
    energy: number;
    valence: number;
    tempo: { min: number; max: number };
    detectedKeywords: string[];
    analysis: object;
  };
  meta: {
    requestId: string;
    processingTime: number;
    analysisMethod: string;
    version: string;
  };
}

async function analyzeMood(moodText: string): Promise<MoodAnalysisResponse> {
  const response = await fetch("/api/analyze-mood", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ moodText }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Usage
try {
  const result = await analyzeMood("I'm feeling great today!");
  console.log(`Detected mood: ${result.data.mood}`);
  console.log(`Confidence: ${result.data.confidence}`);
  console.log(`Recommended genres: ${result.data.genres.join(", ")}`);
} catch (error) {
  console.error("Mood analysis failed:", error);
}
```

### Python

```python
import requests
import json

def analyze_mood(mood_text: str) -> dict:
    """Analyze mood using the MoodTunes API."""
    url = "http://localhost:3000/api/analyze-mood"
    payload = {"moodText": mood_text}
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()

    return response.json()

def suggest_songs(mood: str, genres: list) -> dict:
    """Get song suggestions based on mood analysis."""
    url = "http://localhost:3000/api/suggest-songs"
    payload = {
        "mood": mood,
        "genres": genres
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()

    return response.json()

# Usage example
try:
    # Analyze mood
    mood_result = analyze_mood("I'm feeling energetic and ready to work out!")
    print(f"Detected mood: {mood_result['data']['mood']}")

    # Get song suggestions
    songs_result = suggest_songs(
        mood_result['data']['mood'],
        mood_result['data']['genres']
    )

    print(f"Found {songs_result['suggestions']['totalTracks']} songs:")
    for track in songs_result['suggestions']['tracks'][:5]:
        print(f"- {track['name']} by {', '.join(track['artists'])}")

except requests.exceptions.RequestException as e:
    print(f"API request failed: {e}")
```

## Testing the API

### Using curl

```bash
# Test mood analysis
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "I feel amazing today!"}'

# Test song suggestions
curl -X POST http://localhost:3000/api/suggest-songs \
  -H "Content-Type: application/json" \
  -d '{"mood": "happy", "genres": ["pop", "dance"]}'

# Test error handling
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": ""}'
```

### Using Postman

1. **Create a new request**

   - Method: POST
   - URL: `http://localhost:3000/api/analyze-mood`

2. **Set headers**

   - Content-Type: `application/json`

3. **Set body (raw JSON)**

   ```json
   {
     "moodText": "I'm feeling fantastic and ready to dance!"
   }
   ```

4. **Send request and verify response**

## API Versioning

The current API version is `4.0.0`. Version information is included in response metadata:

```json
{
  "meta": {
    "version": "4.0.0",
    "analysisMethod": "advanced_keyword_sentiment"
  }
}
```

Future versions will maintain backward compatibility where possible, with breaking changes requiring a new major version.

# MoodTunes - Song Recommendations

Transform your feelings into perfect song suggestions. MoodTunes analyzes your emotional state using advanced mood detection algorithms and recommends personalized songs from Spotify that match exactly how you're feeling.

## ✨ Features

- **Advanced Mood Analysis**: Sophisticated sentiment analysis with keyword detection and contextual understanding
- **Intelligent Music Matching**: Maps emotions to musical characteristics (energy, valence, tempo, genres)
- **Dynamic Visual Experience**: Beautiful particle-based animations with the Vortex background component
- **Spotify Integration**: Direct links to songs with album art, artist info, and external Spotify links
- **Mood History**: Track your emotional journey with persistent local storage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility First**: Full keyboard navigation, screen reader support, and reduced motion preferences
- **Fallback System**: Graceful handling when Spotify API is unavailable

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Spotify Developer Account (for API access)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/mood-music.git
   cd mood-music
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Spotify API**

   - Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Copy your Client ID and Client Secret
   - Add them to your `.env.local` file:

   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎵 How It Works

### 1. Express Your Mood

Type how you're feeling in natural language. Be as descriptive as you want:

- "I'm feeling energetic and ready to conquer the world!"
- "Feeling a bit melancholy and nostalgic today"
- "Super happy and want to dance!"

### 2. Advanced AI Analysis

Our sophisticated mood analysis system:

- **Keyword Detection**: Identifies mood-specific keywords and phrases
- **Sentiment Analysis**: Analyzes positive, negative, and neutral sentiment
- **Contextual Understanding**: Considers intensity, temporal context, and negation
- **Confidence Scoring**: Provides reliability metrics for mood detection
- **Musical Mapping**: Converts emotions to musical parameters (energy, valence, tempo)

### 3. Intelligent Song Curation

Using Spotify's Web API, we:

- Search across multiple genres based on your detected mood
- Retrieve up to 10 songs per genre for variety
- Remove duplicates and shuffle for randomness
- Provide rich metadata (album art, artist info, release dates)
- Include direct Spotify links for instant listening

### 4. Immersive Visual Experience

Dynamic Vortex background with:

- **Particle System**: 700+ animated particles using Simplex noise
- **Responsive Animation**: Adapts to screen size and device capabilities
- **Performance Optimized**: 60fps target with hardware acceleration
- **Accessibility Support**: Respects `prefers-reduced-motion` settings

### 5. Persistent History

- **Local Storage**: Saves your mood journey locally
- **Recent History**: Keeps track of your last 3 mood analyses
- **Detailed Views**: Review past moods and their song recommendations
- **Privacy First**: All data stays on your device

## 🎨 Mood Categories

Our AI recognizes 10 distinct mood categories with sophisticated analysis:

| Mood           | Music Genres                    | Energy | Valence | Tempo (BPM) | Key Characteristics        |
| -------------- | ------------------------------- | ------ | ------- | ----------- | -------------------------- |
| **Happy**      | Pop, Dance, Funk, Disco         | 0.8    | 0.9     | 120-140     | Joyful, celebratory        |
| **Sad**        | Blues, Indie, Folk, Alternative | 0.3    | 0.2     | 60-90       | Melancholy, introspective  |
| **Energetic**  | Electronic, EDM, Techno, House  | 0.95   | 0.7     | 128-160     | High-intensity, motivating |
| **Relaxed**    | Ambient, Chillout, Lo-fi, Jazz  | 0.4    | 0.6     | 60-100      | Calm, peaceful             |
| **Angry**      | Rock, Metal, Punk, Hardcore     | 0.9    | 0.1     | 140-180     | Intense, aggressive        |
| **Romantic**   | R&B, Soul, Jazz, Indie-pop      | 0.5    | 0.8     | 80-120      | Tender, affectionate       |
| **Nostalgic**  | Classic Rock, Oldies, Folk      | 0.5    | 0.6     | 90-130      | Wistful, reminiscent       |
| **Anxious**    | Indie, Alternative, Ambient     | 0.6    | 0.3     | 100-130     | Restless, worried          |
| **Confident**  | Hip-hop, Rap, Trap, Funk        | 0.8    | 0.8     | 110-140     | Bold, empowering           |
| **Thoughtful** | Jazz, Classical, Post-rock      | 0.4    | 0.5     | 70-110      | Contemplative, deep        |

## 🛠️ Development

### Project Structure

```
moodtunes/
├── src/
│   ├── app/                    # Next.js 15 app directory
│   │   ├── api/               # API routes
│   │   │   ├── analyze-mood/  # Mood analysis endpoint
│   │   │   └── suggest-songs/ # Song recommendations endpoint
│   │   ├── history/           # Mood history pages
│   │   │   ├── [id]/         # Individual history entry
│   │   │   └── page.jsx      # History overview
│   │   ├── suggestions/       # Song suggestions display
│   │   ├── about/            # About page
│   │   ├── globals.css       # Global styles with Tailwind
│   │   ├── layout.js         # Root layout with theme provider
│   │   └── page.jsx          # Home page with mood input
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── button.jsx   # Button component
│   │   │   ├── card.jsx     # Card component
│   │   │   ├── textarea.jsx # Textarea component
│   │   │   ├── vortex.jsx   # Animated background component
│   │   │   └── resizable-navbar.jsx # Navigation component
│   │   ├── Navbar.jsx       # Main navigation
│   │   ├── Footer.jsx       # Footer component
│   │   └── theme-provider.tsx # Dark/light theme provider
│   └── lib/                 # Core libraries
│       ├── mood-analyzer.js # Advanced mood analysis engine
│       ├── spotify-api.js   # Spotify Web API integration
│       └── utils.js         # Utility functions
├── .kiro/                   # Kiro AI assistant configuration
├── docs/                    # Additional documentation
└── public/                  # Static assets
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint for code quality checks
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Spotify API Configuration (Required)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Application Settings (Optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: The application uses a built-in mood analysis engine and doesn't require external AI services like OpenAI.

## 🧪 Testing

The application includes comprehensive error handling and fallback systems:

### Built-in Testing Features

- **API Error Handling**: Graceful fallbacks when Spotify API is unavailable
- **Input Validation**: Comprehensive mood text validation (3-500 characters)
- **Fallback Responses**: Sample suggestions when external services fail
- **Client-side Validation**: Real-time input validation and error feedback
- **Accessibility Testing**: Built-in support for screen readers and keyboard navigation

### Manual Testing

```bash
# Test the application locally
pnpm dev

# Test API endpoints directly
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "I feel happy today!"}'

curl -X POST http://localhost:3000/api/suggest-songs \
  -H "Content-Type: application/json" \
  -d '{"mood": "happy", "genres": ["pop", "dance"]}'
```

## 🎯 API Reference

### Mood Analysis API

**POST** `/api/analyze-mood`

Analyzes mood text using advanced sentiment analysis and keyword detection.

```javascript
// Request
{
  "moodText": "I'm feeling happy and energetic today!"
}

// Response
{
  "success": true,
  "data": {
    "mood": "happy",
    "confidence": 0.85,
    "genres": ["pop", "dance", "funk", "disco"],
    "energy": 0.8,
    "valence": 0.9,
    "tempo": { "min": 120, "max": 140 },
    "detectedKeywords": ["happy", "energetic"],
    "analysis": {
      "sentimentScore": {
        "positive": 2.5,
        "negative": 0,
        "neutral": 0,
        "overall": 2.5
      },
      "contextFactors": {
        "temporal": { "past": 0, "present": 1, "future": 0 },
        "intensity": { "high": 0, "medium": 1, "low": 0 }
      },
      "sentences": 1,
      "complexity": { "avgWordLength": 5.2, "avgSentenceLength": 8 }
    }
  },
  "meta": {
    "requestId": "req_1234567890_abc123",
    "processingTime": 45,
    "analysisMethod": "advanced_keyword_sentiment",
    "version": "4.0.0"
  }
}
```

### Song Suggestions API

**POST** `/api/suggest-songs`

Generates personalized song recommendations from Spotify.

```javascript
// Request
{
  "mood": "happy",
  "genres": ["pop", "dance"],
  "moodText": "I'm feeling happy and energetic today!"
}

// Response
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
          "images": [{"url": "https://i.scdn.co/image/..."}],
          "release_date": "2014-03-03"
        },
        "external_urls": {"spotify": "https://open.spotify.com/track/..."},
        "duration_ms": 232560,
        "popularity": 85,
        "sourceGenre": "pop"
      }
    ],
    "totalTracks": 15,
    "seedGenres": ["pop", "dance"],
    "mood": "I'm feeling happy and energetic today!",
    "moodAnalysis": {
      "genres": ["pop", "dance", "funk"]
    }
  },
  "meta": {
    "requestId": "suggestions_1234567890_xyz789",
    "processingTime": 1250
  }
}
```

### Error Handling

Both APIs include comprehensive error handling with fallback responses:

```javascript
// Error Response
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

// Fallback Response (when Spotify is unavailable)
{
  "success": true,
  "suggestions": {
    "tracks": [/* sample tracks */],
    "fallback": true,
    "message": "Sample song suggestions - Spotify connection unavailable"
  },
  "warning": "Spotify is temporarily unavailable. Here are some sample suggestions."
}
```

## 🎨 Customization

### Adding New Mood Categories

1. **Update mood patterns** in `src/lib/mood-analyzer.js`:

   ```javascript
   const MOOD_PATTERNS = {
     // ... existing moods
     excited: {
       keywords: ["excited", "thrilled", "exhilarated", "pumped"],
       genres: ["electronic", "dance", "pop"],
       energy: 0.9,
       valence: 0.8,
       tempo: { min: 130, max: 160 },
     },
   };
   ```

2. **Add sentiment patterns** for better detection:

   ```javascript
   // Add to SENTIMENT_PATTERNS.positive.words
   "thrilled", "exhilarated", "pumped";
   ```

3. **Test the new mood** by running the analyzer:

   ```javascript
   import { analyzeMoodFromText } from "@/lib/mood-analyzer";

   const result = analyzeMoodFromText("I'm so excited and pumped!");
   console.log(result.mood); // Should detect 'excited'
   ```

### Customizing the Vortex Background

Modify the visual experience in `src/components/ui/vortex.jsx`:

```javascript
// Customize particle system
const particleCount = 700; // Number of particles
const baseSpeed = 0.0; // Base movement speed
const rangeSpeed = 1.5; // Speed variation
const baseHue = 220; // Base color hue
const rangeHue = 100; // Color variation

// Customize visual effects
const backgroundColor = "#000000"; // Background color
const noiseSteps = 3; // Animation complexity
```

### Extending Spotify Integration

Add new search parameters in `src/lib/spotify-api.js`:

```javascript
async searchTracks(query, options = {}) {
  const {
    limit = 20,
    offset = 0,
    market = 'US',        // Add market filtering
    include_external = 'audio' // Include external content
  } = options;

  const queryParams = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
    offset: offset.toString(),
    market,
    include_external
  });
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic deployments on push

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Spotify API Setup

1. **Create Spotify App**:

   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an App"
   - Fill in app details
   - Note your Client ID and Client Secret

2. **Configure Redirect URIs**:

   - Add `http://localhost:3000` for development
   - Add your production URL for deployment

3. **Set Scopes** (if using user authentication):
   - `user-read-private` (for basic user info)
   - `user-read-private`

### Performance Optimization

- **Turbopack**: Uses Next.js 15 with Turbopack for faster builds and development
- **Client-side Caching**: Spotify access tokens are cached to reduce API calls
- **Local Storage**: Mood history is stored locally for instant access
- **Optimized Animations**: Vortex background uses hardware acceleration and respects motion preferences
- **Lazy Loading**: Components and resources are loaded on demand
- **Error Boundaries**: Graceful fallbacks prevent application crashes

## 🐛 Troubleshooting

### Common Issues

**Spotify API Connection Issues**

```
Error: Spotify API credentials not configured
```

- Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `.env.local`
- Ensure your Spotify app is active in the [Developer Dashboard](https://developer.spotify.com/dashboard)
- Check that your app has the correct settings (no redirect URIs needed for client credentials flow)

**Build Errors**

```
Module not found: Can't resolve '@/components/...'
```

- Ensure you're using the correct import paths with the `@/` alias
- Check that `jsconfig.json` is properly configured with path mapping

**Animation Performance Issues**

- The Vortex background automatically respects `prefers-reduced-motion`
- On slower devices, particle count is automatically reduced
- Hardware acceleration is enabled by default for smooth 60fps animations

**Mood Analysis Not Working**

- Ensure mood text is between 3-500 characters
- The system has built-in fallbacks for unrecognized moods
- Check browser console for detailed error messages

### Debug Information

The application provides detailed logging in development mode:

```javascript
// API responses include debug information
{
  "meta": {
    "requestId": "req_1234567890_abc123",
    "processingTime": 45,
    "analysisMethod": "advanced_keyword_sentiment",
    "version": "4.0.0"
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Run** the test suite
6. **Submit** a pull request

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📄 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify Web API** for music data and streaming integration
- **Next.js 15** with Turbopack for the modern React framework
- **Tailwind CSS 4** for utility-first styling and design system
- **Framer Motion** for smooth, performant animations
- **Simplex Noise** for beautiful particle system generation
- **Radix UI** for accessible component primitives
- **Lucide React** and **Tabler Icons** for beautiful iconography

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with Turbopack for fast development and builds
- **Styling**: Tailwind CSS 4 with custom design system and dark mode
- **Animation**: Framer Motion with custom Vortex particle system (700+ particles)
- **UI Components**: Radix UI primitives with custom styling and accessibility
- **Icons**: Lucide React and Tabler Icons for consistent iconography
- **API Integration**: Spotify Web API with client credentials flow
- **Mood Analysis**: Custom-built sentiment analysis engine with 10 mood categories
- **Storage**: Browser localStorage for persistent mood history
- **Deployment**: Optimized for Vercel, Netlify, Railway, and Docker containers

## 📚 Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)**: Detailed system architecture and design decisions
- **[API Documentation](docs/API.md)**: Comprehensive API reference with examples
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Platform-specific deployment instructions
- **[Contributing Guide](CONTRIBUTING.md)**: How to contribute to the project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/zeropse/moodtunes/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zeropse/moodtunes/discussions)
- **Documentation**: Check the `docs/` folder for detailed guides

---

**Made with ❤️ by the MoodTunes team**

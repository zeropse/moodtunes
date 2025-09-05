# Mood Music - AI-Powered Song Recommendations

Transform your feelings into perfect song suggestions. Mood Music analyzes your emotional state and recommends 10-20 songs from Spotify that match exactly how you're feeling.

![Mood Music Demo](https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=Mood+Music+Demo)

## ✨ Features

- **Natural Language Mood Analysis**: Describe your feelings in your own words
- **AI-Powered Music Matching**: Advanced sentiment analysis suggests perfect songs
- **Dynamic Visual Backgrounds**: Immersive animations that match your mood
- **Instant Spotify Integration**: Direct links to songs and artists

- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Accessibility First**: Full keyboard navigation and screen reader support

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

### 2. AI Analysis

Our advanced mood analysis system:

- Analyzes sentiment and emotional keywords
- Maps emotions to music characteristics
- Determines energy levels, genres, and tempo

### 3. Song Suggestions

We use Spotify's recommendation engine to:

- Find tracks matching your mood profile
- Suggest 10-20 curated songs based on energy level
- Provide direct links to each song on Spotify

### 4. Visual Experience

Dynamic backgrounds adapt to your mood:

- **Happy**: Bright colors with playful animations
- **Calm**: Soft gradients with gentle waves
- **Energetic**: Vibrant particles and fast movements
- **Sad**: Muted tones with slow, contemplative effects

### 5. Discover & Listen

- Browse personalized song recommendations
- Open individual songs directly in Spotify
- See detailed mood analysis breakdown

## 🎨 Mood Categories

Our AI recognizes 8 primary mood categories:

| Mood          | Music Style                  | Visual Theme                   |
| ------------- | ---------------------------- | ------------------------------ |
| **Happy**     | Pop, Dance, Upbeat           | Bright yellows, fast particles |
| **Sad**       | Acoustic, Folk, Slow         | Blues and grays, gentle waves  |
| **Energetic** | Electronic, Rock, High-tempo | Neon colors, rapid animations  |
| **Calm**      | Ambient, Chill, Peaceful     | Soft pastels, slow gradients   |
| **Anxious**   | Soothing, Ambient, Calming   | Cool tones, steady rhythms     |
| **Romantic**  | R&B, Soul, Love songs        | Warm pinks, heart animations   |
| **Nostalgic** | Classic, Retro, Memories     | Vintage colors, fade effects   |
| **Angry**     | Rock, Metal, Intense         | Red themes, sharp movements    |

## 🛠️ Development

### Project Structure

```
mood-music/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   │   ├── analyze-mood/
│   │   │   └── suggest-songs/
│   │   ├── globals.css     # Global styles
│   │   ├── layout.js       # Root layout
│   │   └── page.jsx        # Home page
│   ├── components/         # React components
│   │   ├── MoodInput.jsx
│   │   ├── SongSuggestions.jsx
│   │   └── DynamicBackground.jsx
│   ├── lib/               # Utility libraries
│   │   ├── mood-analysis.js
│   │   ├── spotify-api.js
│   │   └── background-themes.js
│   └── __tests__/         # Test files
├── .kiro/                 # Kiro spec files
├── public/               # Static assets
└── docs/                # Additional documentation
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Testing
pnpm test         # Run all tests
pnpm test:run     # Run tests once
pnpm test:ui      # Open test UI

# Linting
pnpm lint         # Run ESLint
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Optional: Advanced Features
OPENAI_API_KEY=your_openai_key_for_advanced_analysis
REDIS_URL=redis://localhost:6379_for_caching

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Testing

We maintain comprehensive test coverage across all components:

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test src/components
pnpm test src/lib
pnpm test src/app/api

# Run with coverage
pnpm test --coverage

# Run performance tests
pnpm test src/__tests__/performance.test.js
```

### Test Categories

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and service integration
- **End-to-End Tests**: Complete user workflow testing
- **Performance Tests**: Animation and API response time testing
- **Accessibility Tests**: Screen reader and keyboard navigation

## 🎯 API Reference

### Mood Analysis API

**POST** `/api/analyze-mood`

Analyzes mood text and returns music characteristics.

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
    "genres": ["pop", "dance", "electronic"],
    "energy": 0.8,
    "valence": 0.9,
    "tempo": { "min": 120, "max": 140 },
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
    }
  }
}
```

### Song Suggestions API

**POST** `/api/suggest-songs`

Generates song recommendations based on mood analysis.

```javascript
// Request
{
  "mood": "happy",
  "genres": ["pop", "dance"],
  "energy": 0.8,
  "valence": 0.9,
  "tempo": { "min": 120, "max": 140 },
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
        "artists": [{"name": "Pharrell Williams"}],
        "album": {"name": "G I R L"},
        "external_urls": {"spotify": "https://open.spotify.com/track/..."}
      }
    ],
    "totalTracks": 15,
    "moodAnalysis": {
      "energy": 0.8,
      "valence": 0.9,
      "genres": ["pop", "dance"]
    }
  }
}
```

## 🎨 Customization

### Adding New Mood Categories

1. **Update mood categories** in `src/lib/mood-categories.js`:

   ```javascript
   export const MoodCategory = {
     // ... existing moods
     EXCITED: "excited",
   };
   ```

2. **Add mood mapping** in `src/lib/mood-mappings.js`:

   ```javascript
   [MoodCategory.EXCITED]: {
     genres: ['electronic', 'dance', 'pop'],
     energy: 0.9,
     valence: 0.8,
     tempo: { min: 130, max: 160 },
     backgroundTheme: {
       colors: { primary: '#FF4081', secondary: '#E91E63', accent: '#9C27B0' },
       animation: { type: 'particles', speed: 'fast', intensity: 0.9 }
     }
   }
   ```

3. **Add keywords** in `src/lib/mood-categories.js`:
   ```javascript
   [MoodCategory.EXCITED]: [
     'excited', 'thrilled', 'exhilarated', 'pumped'
   ]
   ```

### Custom Background Themes

Create new themes in `src/lib/background-themes.js`:

```javascript
export const customTheme = {
  colors: {
    primary: "#your-color",
    secondary: "#your-color",
    accent: "#your-color",
  },
  animation: {
    type: "waves", // 'waves', 'particles', 'gradient', 'shapes'
    speed: "medium", // 'slow', 'medium', 'fast'
    intensity: 0.6, // 0.0 - 1.0
  },
};
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

- **Enable caching** with Redis for API responses
- **Use CDN** for static assets
- **Implement service worker** for offline functionality
- **Optimize images** with Next.js Image component

## 🐛 Troubleshooting

### Common Issues

**Spotify API Errors**

```
Error: Invalid client credentials
```

- Check your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Ensure environment variables are properly set

**Build Errors**

```
Module not found: Can't resolve '@/components/...'
```

- Check your import paths
- Ensure all components are properly exported

**Animation Performance**

- Enable hardware acceleration in browser
- Check for `prefers-reduced-motion` settings
- Reduce animation intensity on mobile devices

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=mood-music:*
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify Web API** for music data and recommendations
- **Sentiment.js** for natural language processing
- **Framer Motion** for smooth animations
- **Next.js** for the amazing React framework
- **Tailwind CSS** for utility-first styling

## 📞 Support

- **Documentation**: [docs.mood-music.app](https://docs.mood-music.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/mood-music/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mood-music/discussions)
- **Email**: support@mood-music.app

---

**Made with ❤️ by the Mood Music team**

_Transform your feelings into music, one mood at a time._

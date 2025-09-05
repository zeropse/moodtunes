# Setup Guide - MoodTunes

This comprehensive guide will help you set up the MoodTunes development environment from scratch.

## 📋 Prerequisites

### Required Software

1. **Node.js 18+**

   ```bash
   # Check your Node.js version
   node --version

   # If you need to install/update Node.js:
   # Visit https://nodejs.org/ or use a version manager like nvm
   ```

2. **Package Manager**

   ```bash
   # We recommend pnpm for faster installs
   npm install -g pnpm

   # Verify installation
   pnpm --version
   ```

3. **Git**

   ```bash
   # Check Git installation
   git --version

   # Configure Git (if not already done)
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Spotify Developer Account

1. **Create Spotify Account**

   - Visit [Spotify](https://www.spotify.com/) and create an account if you don't have one

2. **Access Developer Dashboard**

   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Log in with your Spotify account

3. **Create New App**

   - Click "Create an App"
   - Fill in the details:
     - **App Name**: "MoodTunes Development"
     - **App Description**: "Local development for mood-based song suggestions app"
     - **Website**: `http://localhost:3000`
     - **Redirect URI**: `http://localhost:3000/callback` (if using auth)
   - Accept terms and create

4. **Get API Credentials**
   - Note your **Client ID** and **Client Secret**
   - Keep these secure and never commit them to version control

## 🚀 Installation

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/mood-music.git
cd mood-music

# Or if you forked it
git clone https://github.com/YOUR_USERNAME/mood-music.git
cd mood-music
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# This will install:
# - Next.js and React
# - Tailwind CSS
# - Testing libraries (Vitest, Testing Library)
# - Spotify Web API SDK
# - Sentiment analysis library
# - And more...
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env.local

# Open the file in your editor
code .env.local  # VS Code
# or
nano .env.local  # Terminal editor
```

**Configure your `.env.local` file:**

```env
# Spotify API Configuration (Required)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Application URL (Development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Advanced Features
# OPENAI_API_KEY=your_openai_key_for_advanced_analysis
# REDIS_URL=redis://localhost:6379

# Optional: Analytics and Monitoring
# GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
# SENTRY_DSN=your_sentry_dsn

# Development Settings
NODE_ENV=development
```

### 4. Verify Installation

```bash
# Start the development server
pnpm dev

# The app should be available at http://localhost:3000
```

## 🧪 Testing Setup

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (recommended for development)
pnpm test --watch

# Run tests with coverage report
pnpm test --coverage

# Run specific test files
pnpm test src/components/__tests__/MoodInput.test.jsx
```

### Test Categories

The project includes several types of tests:

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test API endpoints and service interactions
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Test animation performance and API response times
5. **Accessibility Tests**: Test screen reader compatibility and keyboard navigation

## 🛠️ Development Tools

### Recommended VS Code Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Browser DevTools

1. **React Developer Tools**

   - Install the React DevTools browser extension
   - Useful for debugging React components and state

2. **Accessibility Tools**
   - Install axe DevTools for accessibility testing
   - Use Lighthouse for performance and accessibility audits

## 🎨 Styling Setup

### Tailwind CSS Configuration

The project uses Tailwind CSS v4. Configuration is in `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4ECDC4",
        secondary: "#44A08D",
        accent: "#FF6B6B",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
```

### Custom CSS

Global styles are in `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors;
  }

  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  }
}
```

## 🔧 Advanced Configuration

### Optional: Redis for Caching

If you want to enable caching for better performance:

```bash
# Install Redis (macOS with Homebrew)
brew install redis

# Start Redis server
brew services start redis

# Add to .env.local
echo "REDIS_URL=redis://localhost:6379" >> .env.local
```

### Optional: OpenAI Integration

For advanced mood analysis:

```bash
# Get API key from https://platform.openai.com/api-keys
# Add to .env.local
echo "OPENAI_API_KEY=your_openai_api_key" >> .env.local
```

### Optional: Database Setup

For persistent song suggestions storage:

```bash
# Using SQLite (simplest for development)
pnpm add sqlite3 prisma

# Initialize Prisma
npx prisma init

# Add to .env.local
echo "DATABASE_URL=file:./dev.db" >> .env.local
```

## 🚀 Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
pnpm install

# 3. Start development server
pnpm dev

# 4. Run tests in watch mode (in another terminal)
pnpm test --watch
```

### Making Changes

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# ... edit files ...

# 3. Run tests
pnpm test

# 4. Run linting
pnpm lint

# 5. Commit changes
git add .
git commit -m "feat: add your feature description"

# 6. Push to your fork
git push origin feature/your-feature-name
```

### Code Quality Checks

```bash
# Run all quality checks
pnpm lint          # ESLint
pnpm type-check    # TypeScript (if using TS)
pnpm test          # All tests
pnpm build         # Production build test
```

## 🐛 Troubleshooting

### Common Issues

**1. Spotify API Errors**

```
Error: Invalid client credentials
```

- Double-check your `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Ensure no extra spaces or quotes in `.env.local`
- Verify your Spotify app is active in the developer dashboard

**2. Port Already in Use**

```
Error: Port 3000 is already in use
```

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -- --port 3001
```

**3. Module Resolution Errors**

```
Module not found: Can't resolve '@/components/...'
```

- Check your import paths
- Ensure `jsconfig.json` or `tsconfig.json` has correct path mapping
- Restart your development server

**4. Tailwind Styles Not Loading**

```bash
# Rebuild Tailwind
pnpm build:css

# Check if Tailwind config is correct
npx tailwindcss --help
```

**5. Test Failures**

```bash
# Clear test cache
pnpm test --clearCache

# Run tests with verbose output
pnpm test --verbose

# Run specific failing test
pnpm test src/path/to/failing.test.js
```

### Environment Issues

**Node.js Version Mismatch**

```bash
# Check required version in package.json
cat package.json | grep '"node"'

# Use nvm to switch versions
nvm install 18
nvm use 18
```

**Package Installation Issues**

```bash
# Clear package manager cache
pnpm store prune

# Delete node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Performance Issues

**Slow Development Server**

```bash
# Use Turbopack (experimental)
pnpm dev --turbo

# Or disable source maps temporarily
GENERATE_SOURCEMAP=false pnpm dev
```

**Memory Issues**

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm dev
```

## 📊 Monitoring and Debugging

### Development Tools

1. **React DevTools**: Debug component state and props
2. **Network Tab**: Monitor API requests and responses
3. **Console**: Check for errors and debug logs
4. **Lighthouse**: Performance and accessibility audits

### Debugging API Endpoints

```bash
# Test mood analysis endpoint
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "I feel happy today!"}'

# Test song suggestions endpoint
curl -X POST http://localhost:3000/api/suggest-songs \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "happy",
    "genres": ["pop"],
    "energy": 0.8,
    "valence": 0.9,
    "tempo": {"min": 120, "max": 140},
    "moodText": "I feel happy!"
  }'
```

### Performance Monitoring

```javascript
// Add to your components for performance monitoring
import { useEffect } from "react";

function MyComponent() {
  useEffect(() => {
    const start = performance.now();

    return () => {
      const end = performance.now();
      console.log(`Component render time: ${end - start}ms`);
    };
  }, []);

  // ... component code
}
```

## 🎯 Next Steps

Once you have everything set up:

1. **Explore the codebase**: Start with `src/app/page.jsx`
2. **Run the application**: Test the mood analysis and song suggestions
3. **Make a small change**: Try modifying a component or adding a new mood category
4. **Run tests**: Ensure everything still works
5. **Read the contributing guide**: `CONTRIBUTING.md`
6. **Join the community**: Check GitHub discussions and issues

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)

---

**Happy coding! 🎵✨**

If you encounter any issues not covered in this guide, please [open an issue](https://github.com/yourusername/mood-music/issues) or check our [discussions](https://github.com/yourusername/mood-music/discussions).

# MoodTunes Deployment Guide

This guide covers deploying MoodTunes to various platforms, including configuration, environment setup, and best practices.

## Prerequisites

Before deploying, ensure you have:

- **Spotify Developer Account** with app credentials
- **Node.js 18+** for local builds
- **Git repository** with your code
- **Domain name** (optional, for custom domains)

## Platform-Specific Deployment

### 1. Vercel (Recommended)

Vercel provides optimal Next.js 15 support with Turbopack integration.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/moodtunes)

#### Manual Deployment

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy from project directory**

   ```bash
   vercel
   ```

4. **Set environment variables**

   ```bash
   vercel env add SPOTIFY_CLIENT_ID
   vercel env add SPOTIFY_CLIENT_SECRET
   ```

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

Create `vercel.json` for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "functions": {
    "src/app/api/*/route.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 2. Netlify

Alternative deployment platform with good Next.js support.

#### Deploy Steps

1. **Connect repository** to Netlify
2. **Configure build settings**:

   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Node version: `18`

3. **Set environment variables** in Netlify dashboard:

   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
   ```

4. **Deploy**

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--version"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### 3. Railway

Simple deployment with automatic builds.

#### Deploy Steps

1. **Connect GitHub repository** to Railway
2. **Set environment variables**:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```
3. **Deploy automatically** on push

### 4. Docker Deployment

For containerized deployments on any platform.

#### Dockerfile

```dockerfile
# Use Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm build; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: "3.8"

services:
  moodtunes:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
      - SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/analyze-mood"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Build and Run

```bash
# Build the image
docker build -t moodtunes .

# Run the container
docker run -p 3000:3000 \
  -e SPOTIFY_CLIENT_ID=your_client_id \
  -e SPOTIFY_CLIENT_SECRET=your_client_secret \
  moodtunes

# Or use Docker Compose
docker-compose up -d
```

### 5. AWS Deployment

#### Using AWS Amplify

1. **Connect repository** to AWS Amplify
2. **Configure build settings**:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install -g pnpm
           - pnpm install
       build:
         commands:
           - pnpm build
     artifacts:
       baseDirectory: .next
       files:
         - "**/*"
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Set environment variables** in Amplify console

#### Using AWS ECS with Fargate

1. **Build and push Docker image** to ECR
2. **Create ECS task definition**
3. **Deploy to Fargate cluster**

Example task definition:

```json
{
  "family": "moodtunes",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "moodtunes",
      "image": "your-account.dkr.ecr.region.amazonaws.com/moodtunes:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPOTIFY_CLIENT_ID",
          "value": "your_client_id"
        },
        {
          "name": "SPOTIFY_CLIENT_SECRET",
          "value": "your_client_secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/moodtunes",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## Environment Configuration

### Required Environment Variables

```env
# Spotify API (Required)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app

# Application URL (Required)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# JSONBin.io for Sharing (Optional)
JSONBIN_API_KEY=your_jsonbin_api_key_here
```

### API Service Configuration

#### Spotify App Setup

1. **Go to** [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Create a new app** with these settings:
   - App name: MoodTunes
   - App description: AI-powered mood-based music recommendations
   - Website: Your deployment URL
   - Redirect URIs: Not required (using client credentials flow)
3. **Copy Client ID and Client Secret** to environment variables

#### Clerk Authentication Setup

1. **Go to** [Clerk Dashboard](https://dashboard.clerk.com/)
2. **Create a new application**:
   - Application name: MoodTunes
   - Sign-in options: Email, Google, GitHub (recommended)
3. **Configure authentication**:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/app`
   - After sign-up URL: `/app`
4. **Copy publishable key and secret key** to environment variables

#### JSONBin.io Setup (Optional - for sharing feature)

1. **Go to** [JSONBin.io](https://jsonbin.io)
2. **Create a free account** (100,000 requests/month)
3. **Get API key** from dashboard
4. **Add to environment variables** for sharing functionality

### Security Considerations

#### Environment Variables Security

- **Never commit** `.env` files to version control
- **Use platform-specific** secret management (Vercel Secrets, AWS Secrets Manager, etc.)
- **Rotate credentials** regularly
- **Use different credentials** for development and production

#### Content Security Policy

Add to `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.spotify.com https://accounts.spotify.com",
              "media-src 'self' https:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack for faster builds
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Optimize images
  images: {
    domains: ["i.scdn.co"], // Spotify image domains
    formats: ["image/webp", "image/avif"],
  },

  // Enable compression
  compress: true,

  // Optimize bundle
  swcMinify: true,

  // Static optimization
  trailingSlash: false,

  // Headers for caching
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### CDN Configuration

For static assets, configure CDN caching:

```javascript
// next.config.mjs
const nextConfig = {
  assetPrefix:
    process.env.NODE_ENV === "production" ? "https://cdn.your-domain.com" : "",
};
```

## Monitoring and Analytics

### Health Checks

Create a health check endpoint:

```javascript
// src/app/api/health/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check Spotify API connectivity
    const spotifyHealth = await fetch("https://api.spotify.com/v1", {
      method: "HEAD",
    });

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        spotify: spotifyHealth.ok ? "up" : "down",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

### Error Tracking

For production deployments, consider integrating:

- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage analytics

```javascript
// Example Sentry integration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Build locally to test
pnpm build
```

#### Environment Variable Issues

```bash
# Verify environment variables are set
echo $SPOTIFY_CLIENT_ID
echo $SPOTIFY_CLIENT_SECRET

# Test API endpoints locally
curl -X POST http://localhost:3000/api/analyze-mood \
  -H "Content-Type: application/json" \
  -d '{"moodText": "test"}'
```

#### Spotify API Issues

- **Check credentials** in Spotify Developer Dashboard
- **Verify app status** (not in development mode)
- **Check rate limits** and quotas
- **Test with curl**:

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Authorization: Basic $(echo -n 'client_id:client_secret' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

### Performance Issues

#### Slow API Responses

- **Check Spotify API latency**
- **Implement caching** for repeated requests
- **Optimize mood analysis** algorithm
- **Use CDN** for static assets

#### Memory Issues

- **Monitor memory usage** in production
- **Optimize particle system** parameters
- **Implement proper cleanup** for animations

## Maintenance

### Regular Tasks

1. **Update dependencies** monthly
2. **Rotate Spotify credentials** quarterly
3. **Monitor error rates** and performance
4. **Review security headers** and CSP
5. **Update documentation** as needed

### Backup Strategy

- **Code**: Version control with Git
- **Configuration**: Environment variable documentation
- **User data**: Local storage (no server-side data)

### Scaling Considerations

For high-traffic deployments:

1. **Implement Redis caching** for Spotify tokens
2. **Use load balancer** for multiple instances
3. **Add rate limiting** for API endpoints
4. **Monitor resource usage** and scale accordingly

This deployment guide should help you successfully deploy MoodTunes to your preferred platform while maintaining security and performance best practices.

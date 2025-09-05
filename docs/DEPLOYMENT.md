# Deployment Guide

This guide covers deploying the MoodTunes application to various platforms and environments.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mood-music)

1. **Connect Repository**

   - Fork the repository to your GitHub account
   - Connect your GitHub account to Vercel
   - Import the mood-music repository

2. **Configure Environment Variables**

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Subsequent pushes to main branch will auto-deploy

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/mood-music)

1. **Connect Repository**

   - Fork the repository
   - Connect to Netlify via GitHub

2. **Build Settings**

   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Node version: `18`

3. **Environment Variables**
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
   ```

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/mood-music)

1. **One-Click Deploy**

   - Click the Railway button above
   - Connect your GitHub account
   - Set environment variables

2. **Configuration**
   - Railway will auto-detect Next.js
   - No additional configuration needed

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Create docker-compose.yml**

   ```yaml
   version: "3.8"

   services:
     mood-music:
       build: .
       ports:
         - "3000:3000"
       environment:
         - SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
         - SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
         - NEXT_PUBLIC_APP_URL=http://localhost:3000
       restart: unless-stopped

     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
       restart: unless-stopped
       command: redis-server --appendonly yes
       volumes:
         - redis_data:/data

   volumes:
     redis_data:
   ```

2. **Create .env file**

   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Standalone Docker

1. **Build Image**

   ```bash
   docker build -t mood-music .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name mood-music \
     -p 3000:3000 \
     -e SPOTIFY_CLIENT_ID=your_client_id \
     -e SPOTIFY_CLIENT_SECRET=your_client_secret \
     -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
     mood-music
   ```

### Multi-Stage Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## ☁️ Cloud Platform Deployments

### AWS (Amazon Web Services)

#### Using AWS Amplify

1. **Connect Repository**

   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Build Settings**
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
         - .next/cache/**/*
   ```

#### Using AWS ECS (Fargate)

1. **Create Task Definition**

   ```json
   {
     "family": "mood-music",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
     "containerDefinitions": [
       {
         "name": "mood-music",
         "image": "your-account.dkr.ecr.region.amazonaws.com/mood-music:latest",
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
           }
         ],
         "secrets": [
           {
             "name": "SPOTIFY_CLIENT_SECRET",
             "valueFrom": "arn:aws:secretsmanager:region:account:secret:spotify-secret"
           }
         ]
       }
     ]
   }
   ```

2. **Deploy with CDK**

   ```typescript
   import * as ecs from "aws-cdk-lib/aws-ecs";
   import * as ec2 from "aws-cdk-lib/aws-ec2";

   const cluster = new ecs.Cluster(this, "MoodMusicCluster", {
     vpc: vpc,
   });

   const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
     memoryLimitMiB: 512,
     cpu: 256,
   });

   const container = taskDefinition.addContainer("mood-music", {
     image: ecs.ContainerImage.fromRegistry("your-image"),
     environment: {
       NEXT_PUBLIC_APP_URL: "https://your-domain.com",
     },
     secrets: {
       SPOTIFY_CLIENT_SECRET: ecs.Secret.fromSecretsManager(secret),
     },
   });

   container.addPortMappings({
     containerPort: 3000,
   });
   ```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and Push Image**

   ```bash
   # Build image
   docker build -t gcr.io/PROJECT_ID/mood-music .

   # Push to Container Registry
   docker push gcr.io/PROJECT_ID/mood-music
   ```

2. **Deploy to Cloud Run**

   ```bash
   gcloud run deploy mood-music \
     --image gcr.io/PROJECT_ID/mood-music \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NEXT_PUBLIC_APP_URL=https://your-service-url \
     --set-secrets SPOTIFY_CLIENT_SECRET=spotify-secret:latest
   ```

3. **Using Cloud Build**
   ```yaml
   # cloudbuild.yaml
   steps:
     - name: "gcr.io/cloud-builders/docker"
       args: ["build", "-t", "gcr.io/$PROJECT_ID/mood-music", "."]
     - name: "gcr.io/cloud-builders/docker"
       args: ["push", "gcr.io/$PROJECT_ID/mood-music"]
     - name: "gcr.io/cloud-builders/gcloud"
       args:
         - "run"
         - "deploy"
         - "mood-music"
         - "--image"
         - "gcr.io/$PROJECT_ID/mood-music"
         - "--region"
         - "us-central1"
         - "--platform"
         - "managed"
         - "--allow-unauthenticated"
   ```

#### Using App Engine

1. **Create app.yaml**

   ```yaml
   runtime: nodejs18

   env_variables:
     NEXT_PUBLIC_APP_URL: https://PROJECT_ID.appspot.com

   automatic_scaling:
     min_instances: 0
     max_instances: 10
     target_cpu_utilization: 0.6
   ```

2. **Deploy**
   ```bash
   gcloud app deploy
   ```

### Microsoft Azure

#### Using Azure Container Instances

1. **Create Resource Group**

   ```bash
   az group create --name mood-music-rg --location eastus
   ```

2. **Deploy Container**
   ```bash
   az container create \
     --resource-group mood-music-rg \
     --name mood-music \
     --image your-registry/mood-music:latest \
     --dns-name-label mood-music-app \
     --ports 3000 \
     --environment-variables \
       NEXT_PUBLIC_APP_URL=https://mood-music-app.eastus.azurecontainer.io \
     --secure-environment-variables \
       SPOTIFY_CLIENT_ID=your_client_id \
       SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

#### Using Azure App Service

1. **Create App Service Plan**

   ```bash
   az appservice plan create \
     --name mood-music-plan \
     --resource-group mood-music-rg \
     --sku B1 \
     --is-linux
   ```

2. **Create Web App**

   ```bash
   az webapp create \
     --resource-group mood-music-rg \
     --plan mood-music-plan \
     --name mood-music-app \
     --deployment-container-image-name your-registry/mood-music:latest
   ```

3. **Configure Environment Variables**
   ```bash
   az webapp config appsettings set \
     --resource-group mood-music-rg \
     --name mood-music-app \
     --settings \
       SPOTIFY_CLIENT_ID=your_client_id \
       SPOTIFY_CLIENT_SECRET=your_client_secret \
       NEXT_PUBLIC_APP_URL=https://mood-music-app.azurewebsites.net
   ```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Required
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_APP_URL=https://your-production-domain.com

# Optional Performance
REDIS_URL=redis://your-redis-instance:6379
NODE_ENV=production

# Optional Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
SENTRY_DSN=your_sentry_dsn

# Optional Advanced Features
OPENAI_API_KEY=your_openai_key

# Security
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-production-domain.com
```

### Spotify App Configuration

1. **Update Redirect URIs**

   - Add your production domain to Spotify app settings
   - Example: `https://your-domain.com/api/auth/callback/spotify`

2. **Update App URLs**
   - Website: `https://your-domain.com`
   - Privacy Policy: `https://your-domain.com/privacy`
   - Terms of Service: `https://your-domain.com/terms`

## 🔒 Security Considerations

### HTTPS Configuration

1. **SSL Certificate**

   - Use Let's Encrypt for free certificates
   - Configure automatic renewal

2. **Security Headers**
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: "/(.*)",
           headers: [
             {
               key: "X-Frame-Options",
               value: "DENY",
             },
             {
               key: "X-Content-Type-Options",
               value: "nosniff",
             },
             {
               key: "Referrer-Policy",
               value: "origin-when-cross-origin",
             },
             {
               key: "Content-Security-Policy",
               value:
                 "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
             },
           ],
         },
       ];
     },
   };
   ```

### Environment Security

1. **Secret Management**

   - Use platform-specific secret managers
   - Never commit secrets to version control
   - Rotate secrets regularly

2. **API Rate Limiting**

   ```javascript
   // Implement rate limiting
   import rateLimit from "express-rate-limit";

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   });
   ```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Sentry Integration**

   ```javascript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

2. **Custom Logging**

   ```javascript
   // lib/logger.js
   import winston from "winston";

   const logger = winston.createLogger({
     level: "info",
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: "error.log", level: "error" }),
       new winston.transports.File({ filename: "combined.log" }),
     ],
   });
   ```

### Performance Monitoring

1. **Web Vitals**

   ```javascript
   // pages/_app.js
   export function reportWebVitals(metric) {
     if (metric.label === "web-vital") {
       console.log(metric);
       // Send to analytics
     }
   }
   ```

2. **API Monitoring**

   ```javascript
   // Middleware for API monitoring
   export function withMonitoring(handler) {
     return async (req, res) => {
       const start = Date.now();

       try {
         await handler(req, res);
       } catch (error) {
         console.error("API Error:", error);
         throw error;
       } finally {
         const duration = Date.now() - start;
         console.log(`${req.method} ${req.url} - ${duration}ms`);
       }
     };
   }
   ```

## 🚀 Performance Optimization

### Build Optimization

1. **Bundle Analysis**

   ```bash
   # Analyze bundle size
   ANALYZE=true pnpm build
   ```

2. **Image Optimization**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ["i.scdn.co", "mosaic.scdn.co"],
       formats: ["image/webp", "image/avif"],
     },
   };
   ```

### Caching Strategy

1. **Redis Caching**

   ```javascript
   // lib/cache.js
   import Redis from "ioredis";

   const redis = new Redis(process.env.REDIS_URL);

   export async function getCached(key) {
     const cached = await redis.get(key);
     return cached ? JSON.parse(cached) : null;
   }

   export async function setCached(key, data, ttl = 3600) {
     await redis.setex(key, ttl, JSON.stringify(data));
   }
   ```

2. **CDN Configuration**
   ```javascript
   // next.config.js
   module.exports = {
     assetPrefix: process.env.CDN_URL || "",
     images: {
       loader: "custom",
       loaderFile: "./lib/imageLoader.js",
     },
   };
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test

      - name: Run linting
        run: pnpm lint

      - name: Build application
        run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  before_script:
    - npm install -g pnpm
    - pnpm install --frozen-lockfile
  script:
    - pnpm test
    - pnpm lint
  cache:
    paths:
      - node_modules/

build:
  stage: build
  image: node:$NODE_VERSION
  before_script:
    - npm install -g pnpm
    - pnpm install --frozen-lockfile
  script:
    - pnpm build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t mood-music .
    - docker tag mood-music $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
```

## 🔍 Troubleshooting

### Common Deployment Issues

1. **Build Failures**

   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

2. **Environment Variable Issues**

   ```bash
   # Check environment variables
   printenv | grep SPOTIFY

   # Test API connectivity
   curl -X POST https://accounts.spotify.com/api/token \
     -H "Authorization: Basic $(echo -n $SPOTIFY_CLIENT_ID:$SPOTIFY_CLIENT_SECRET | base64)" \
     -d "grant_type=client_credentials"
   ```

3. **Memory Issues**
   ```javascript
   // Increase Node.js memory limit
   "scripts": {
     "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
   }
   ```

### Health Checks

1. **Application Health Endpoint**

   ```javascript
   // pages/api/health.js
   export default function handler(req, res) {
     res.status(200).json({
       status: "healthy",
       timestamp: new Date().toISOString(),
       version: process.env.npm_package_version,
     });
   }
   ```

2. **Database Connectivity**
   ```javascript
   // pages/api/health/db.js
   export default async function handler(req, res) {
     try {
       // Test database connection
       await testConnection();
       res.status(200).json({ status: "healthy" });
     } catch (error) {
       res.status(503).json({ status: "unhealthy", error: error.message });
     }
   }
   ```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancer Configuration**

   ```nginx
   upstream mood_music {
       server app1:3000;
       server app2:3000;
       server app3:3000;
   }

   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://mood_music;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

2. **Session Management**

   ```javascript
   // Use Redis for session storage
   import session from "express-session";
   import RedisStore from "connect-redis";

   app.use(
     session({
       store: new RedisStore({ client: redisClient }),
       secret: process.env.SESSION_SECRET,
       resave: false,
       saveUninitialized: false,
     })
   );
   ```

### Database Scaling

1. **Read Replicas**

   ```javascript
   // Database connection with read replicas
   const writeDB = new Database(process.env.WRITE_DB_URL);
   const readDB = new Database(process.env.READ_DB_URL);

   export function getConnection(operation = "read") {
     return operation === "write" ? writeDB : readDB;
   }
   ```

2. **Caching Layer**

   ```javascript
   // Multi-level caching
   export async function getCachedData(key) {
     // L1: Memory cache
     let data = memoryCache.get(key);
     if (data) return data;

     // L2: Redis cache
     data = await redisCache.get(key);
     if (data) {
       memoryCache.set(key, data, 300); // 5 min
       return data;
     }

     // L3: Database
     data = await database.get(key);
     if (data) {
       await redisCache.set(key, data, 3600); // 1 hour
       memoryCache.set(key, data, 300); // 5 min
     }

     return data;
   }
   ```

---

For more deployment options and advanced configurations, see the [main documentation](../README.md) or reach out to the community for support.

# 🚀 Link Velocity Pro - Deployment Guide
> *"Deploy at the Speed of Light"*

## 🎯 Overview

This guide covers deploying Link Velocity Pro to production with zero cost, maximum performance, and easy scaling. We'll use Vercel for hosting and Vercel Postgres for the database.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel Edge   │────│   Next.js App   │────│   Vercel DB     │
│   (Global CDN)  │    │   (API Routes)  │    │   (Postgres)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Analytics     │    │   URL Storage   │    │   Click Tracking│
│   Dashboard     │    │   & Management  │    │   & Analytics   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Prerequisites

### Required Tools
```bash
# Install Node.js (18+)
# Download from https://nodejs.org

# Install Vercel CLI
npm install -g vercel

# Install Git
# Download from https://git-scm.com
```

### Required Accounts
- **Vercel**: https://vercel.com (Free tier: unlimited personal projects)
- **GitHub**: https://github.com (Free tier)
- **Stripe**: https://stripe.com (2.9% + 30¢ per transaction)

## 🚀 Step 1: Local Development Setup

### 1.1 Initialize Project
```bash
# Clone the repository
git clone <your-repo-url>
cd link-velocity-pro

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 1.2 Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/link_velocity_pro
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 1.3 Database Setup
```sql
-- Create database tables
CREATE TABLE links (
    id VARCHAR(255) PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    clicks INTEGER DEFAULT 0
);

CREATE TABLE click_analytics (
    id VARCHAR(255) PRIMARY KEY,
    link_id VARCHAR(255) REFERENCES links(id),
    ip_address VARCHAR(255),
    user_agent TEXT,
    referer TEXT,
    clicked_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_links_short_id ON links(short_id);
CREATE INDEX idx_click_analytics_link_id ON click_analytics(link_id);
CREATE INDEX idx_click_analytics_clicked_at ON click_analytics(clicked_at);
```

### 1.4 Test Locally
```bash
# Run development server
npm run dev

# Test the API
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Expected response:
# {"shortUrl": "http://localhost:3000/l/abc123", "originalUrl": "https://example.com", ...}
```

## 🚀 Step 2: Vercel Deployment

### 2.1 Create Vercel Project
```bash
# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: link-velocity-pro
# - Directory: ./
# - Override settings? N
```

### 2.2 Configure Environment Variables
```bash
# Set environment variables in Vercel dashboard
# Or use CLI:
vercel env add NEXT_PUBLIC_BASE_URL
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
```

### 2.3 Database Setup
```bash
# Create Vercel Postgres database
vercel storage create postgres

# Get connection string
vercel storage connect postgres

# Run database migrations
vercel db push
```

### 2.4 Deploy to Production
```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

## 🚀 Step 3: Domain Configuration

### 3.1 Custom Domain (Optional)
```bash
# Add custom domain
vercel domains add link-velocity-pro.com

# Configure DNS
# Add CNAME record: www -> cname.vercel-dns.com
# Add A record: @ -> 76.76.19.61
```

### 3.2 SSL Certificate
```bash
# SSL is automatically configured by Vercel
# No additional setup required
```

## 🚀 Step 4: Database Migration

### 4.1 Production Database Setup
```sql
-- Run in Vercel Postgres console
CREATE TABLE links (
    id VARCHAR(255) PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    clicks INTEGER DEFAULT 0
);

CREATE TABLE click_analytics (
    id VARCHAR(255) PRIMARY KEY,
    link_id VARCHAR(255) REFERENCES links(id),
    ip_address VARCHAR(255),
    user_agent TEXT,
    referer TEXT,
    clicked_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_links_short_id ON links(short_id);
CREATE INDEX idx_click_analytics_link_id ON click_analytics(link_id);
CREATE INDEX idx_click_analytics_clicked_at ON click_analytics(clicked_at);
```

### 4.2 Test Production API
```bash
# Test production API
curl -X POST https://link-velocity-pro.vercel.app/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 🚀 Step 5: Performance Optimization

### 5.1 Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "regions": ["iad1"],
  "framework": "nextjs"
}
```

### 5.2 Edge Functions
```typescript
// src/app/api/redirect/[shortId]/route.ts
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  // Edge function for faster redirects
}
```

### 5.3 Caching Strategy
```typescript
// Cache frequently accessed data
export const revalidate = 3600 // 1 hour

export async function GET() {
  // Cached response
}
```

## 🚀 Step 6: Monitoring & Analytics

### 6.1 Vercel Analytics
```bash
# Enable Vercel Analytics
vercel analytics enable
```

### 6.2 Error Tracking
```typescript
// src/lib/error-tracking.ts
export function trackError(error: Error, context: any) {
  console.error('Error:', error, context)
  // Send to error tracking service
}
```

### 6.3 Performance Monitoring
```typescript
// src/lib/performance.ts
export function trackPerformance(name: string, duration: number) {
  console.log(`Performance: ${name} took ${duration}ms`)
  // Send to analytics service
}
```

## 🚀 Step 7: Security & Compliance

### 7.1 Rate Limiting
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function rateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier)
  return success
}
```

### 7.2 Input Validation
```typescript
// src/lib/validation.ts
import { z } from 'zod'

export const urlSchema = z.object({
  url: z.string().url('Invalid URL format')
})

export function validateUrl(data: any) {
  return urlSchema.parse(data)
}
```

### 7.3 CORS Configuration
```typescript
// src/app/api/route.ts
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
```

## 🚀 Step 8: Scaling Strategy

### 8.1 Database Optimization
```sql
-- Add more indexes as needed
CREATE INDEX idx_links_created_at ON links(created_at);
CREATE INDEX idx_click_analytics_date ON click_analytics(DATE(clicked_at));

-- Partition large tables
CREATE TABLE click_analytics_2024 PARTITION OF click_analytics
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### 8.2 Caching Layer
```typescript
// src/lib/cache.ts
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function getCachedUrl(shortId: string) {
  return await redis.get(`url:${shortId}`)
}

export async function setCachedUrl(shortId: string, url: string) {
  await redis.set(`url:${shortId}`, url, { ex: 3600 })
}
```

### 8.3 CDN Configuration
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/l/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ]
  },
}
```

## 🚀 Step 9: Production Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates valid
- [ ] Domain configured
- [ ] Analytics enabled

### Post-Deployment
- [ ] Health checks passing
- [ ] API endpoints working
- [ ] Database connections stable
- [ ] Error tracking active
- [ ] Performance monitoring enabled
- [ ] Backup systems tested

## 🚀 Step 10: Maintenance & Updates

### 10.1 Zero-Downtime Deployments
```bash
# Deploy with zero downtime
vercel --prod

# Rollback if needed
vercel rollback
```

### 10.2 Database Backups
```bash
# Backup database
vercel db backup

# Restore from backup
vercel db restore <backup-id>
```

### 10.3 Monitoring & Alerts
```bash
# Set up monitoring
vercel monitoring enable

# Configure alerts
vercel alerts add --type error --threshold 5
vercel alerts add --type performance --threshold 1000
```

---

## 🎯 Performance Targets

- **Shortening Time**: <100ms
- **Redirect Time**: <50ms
- **Uptime**: 99.9% SLA
- **Availability**: 24/7 global edge deployment

## 📞 Support

- **Documentation**: https://docs.link-velocity-pro.com
- **Status Page**: https://status.link-velocity-pro.com
- **Support**: support@link-velocity-pro.com
- **Emergency**: +1-800-LINK-VEL

---

*"Deploy fast, scale faster, perform at the speed of light."*

**Link Velocity Pro** - Where deployment meets velocity.

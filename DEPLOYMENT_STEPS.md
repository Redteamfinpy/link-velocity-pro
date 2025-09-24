# 🚀 Link Velocity Pro - Vercel Deployment Guide

## Step 1: Login to Vercel

### Option A: Browser Login (Recommended)
1. Run: `vercel login`
2. Press ENTER to open browser
3. Sign in with GitHub/Google/Email
4. Return to terminal

### Option B: Manual Login
1. Go to: https://vercel.com/oauth/device?user_code=TQTB-SDKL
2. Enter the code: `TQTB-SDKL`
3. Sign in with your account

## Step 2: Deploy to Vercel

### Quick Deploy
```bash
# Deploy to production
vercel --prod

# Or deploy preview first
vercel
```

### Deploy with Custom Domain
```bash
# Deploy and add custom domain
vercel --prod
vercel domains add your-domain.com
```

## Step 3: Environment Variables

Set these in Vercel Dashboard:
- `NEXT_PUBLIC_BASE_URL` = `https://your-app.vercel.app`
- `DATABASE_URL` = (if using database)
- `STRIPE_SECRET_KEY` = (if using payments)

## Step 4: Verify Deployment

1. Visit your deployed URL
2. Test URL shortening: `https://your-app.vercel.app/api/shorten`
3. Test redirects: `https://your-app.vercel.app/l/abc123`

## Step 5: Custom Domain (Optional)

1. Go to Vercel Dashboard → Domains
2. Add your domain
3. Update DNS records
4. SSL certificate auto-generated

## Troubleshooting

### Build Errors
```bash
# Check build locally first
npm run build

# Fix any errors before deploying
```

### Environment Issues
```bash
# Check environment variables
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME
```

## Success! 🎉

Your Link Velocity Pro is now live and ready to generate revenue!

### Next Steps:
1. **Test the API**: Try shortening a URL
2. **Start Marketing**: Use LinkedIn/Reddit strategy
3. **Monitor Analytics**: Check Vercel dashboard
4. **Scale**: Follow business plan to $5k/month

# CloakSeed Deployment Guide

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## Production Build

```bash
npm run build
npm run preview
```

Creates optimized bundle in `dist/` folder.

---

## Vercel Deployment (Easiest)

### Option 1: Via CLI
```bash
npm i -g vercel
vercel
```

Follow prompts. Auto-detects Vite config.

### Option 2: GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Auto-deploys on push

**Environment**: No env vars needed (everything client-side)

---

## Netlify Deployment

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect GitHub for auto-deploy.

**Build settings**:
- Build command: `npm run build`
- Publish directory: `dist`

---

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Build & Run
```bash
docker build -t cloakseed .
docker run -p 3000:3000 cloakseed
```

---

## AWS S3 + CloudFront

```bash
npm run build

# Configure AWS CLI
aws configure

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront (if using CDN)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

## GitHub Pages

1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/cloakseed/', // repository name
  // ... rest of config
});
```

2. Add GitHub Action (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. Push and GitHub automatically deploys to `https://yourusername.github.io/cloakseed`

---

## Cloudflare Pages

1. Push code to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Pages → Create project
4. Select GitHub repo
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy

Auto-deploys on push. Free HTTPS + global CDN.

---

## Self-Hosted (VPS)

### Using Nginx

```bash
npm run build

# Transfer dist folder to server
scp -r dist/ user@server:/var/www/cloakseed/
```

**Nginx config** (`/etc/nginx/sites-available/cloakseed`):
```nginx
server {
    listen 80;
    server_name cloakseed.example.com;

    root /var/www/cloakseed;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTTPS redirect
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/cloakseed.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cloakseed.example.com/privkey.pem;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cloakseed /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Using Node.js + PM2

```bash
npm install -g pm2
npm run build

# Create PM2 app config (ecosystem.config.js)
module.exports = {
  apps: [{
    name: 'cloakseed',
    script: 'npm',
    args: 'run preview',
    env: { NODE_ENV: 'production' }
  }]
};

pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Security Checklist

- ✅ HTTPS enabled (Let's Encrypt free)
- ✅ CSP headers set (no external scripts)
- ✅ No sensitive env vars in code
- ✅ Service Worker caching configured
- ✅ CORS disabled (static site)
- ✅ No analytics/tracking enabled
- ✅ Manifest.json updated for PWA
- ✅ Icons/favicons served correctly

### Example Security Headers (Nginx)
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "no-referrer";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";
```

---

## Performance Tips

1. **Caching**: Set long cache headers on hashed assets
2. **Compression**: Enable gzip/brotli on server
3. **Lazy Loading**: Route-based code splitting (already configured)
4. **PWA**: Service Worker caches assets for offline use
5. **CDN**: Use Cloudflare / Fastly for global distribution

---

## Monitoring & Analytics

Since CloakSeed has zero telemetry, use:
- **Vercel Analytics**: Real-time perf metrics
- **Uptime Robot**: Ping endpoint (free tier)
- **Sentry** (optional): Only for JS error tracking (privacy-respecting)

---

## Rollback & Versioning

### Manual Versioning
```bash
# Bump version in package.json
npm version patch  # v1.0.1
npm version minor  # v1.1.0
npm version major  # v2.0.0

# Tag and push
git push origin main --tags
```

### Auto-Rollback (Vercel)
1. Dashboard → Deployments
2. Click previous version
3. Click "Promote to Production"

---

## DNS Configuration

### For Custom Domain

**Vercel/Netlify CNAME**:
```
cloakseed.example.com CNAME cname.vercel.app
```

**Cloudflare Pages**:
```
cloakseed CNAME account.pages.dev
```

**Route 53 (AWS)**:
```
Type: A
Value: CloudFront distribution domain
```

---

## Stripe Integration (Optional)

For Pro checkout:

1. Create Stripe account
2. Get PUBLIC_KEY
3. In `Settings.tsx`, integrate Stripe.js:

```typescript
const handleUnlockPremium = async () => {
  const stripe = await loadStripe('pk_live_YOUR_KEY');
  await stripe?.redirectToCheckout({
    sessionId: 'cs_live_YOUR_SESSION'
  });
};
```

Backend (optional, for session creation):
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'CloakSeed Pro' },
      unit_amount: 999 // $9.99
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://cloakseed.example.com?success=true',
  cancel_url: 'https://cloakseed.example.com'
});
```

---

## Troubleshooting

**Build fails**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port already in use**:
```bash
# macOS/Linux
lsof -i :3000
kill -9 PID
```

**Service Worker not updating**:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear site data in DevTools

**CORS errors**:
- Ensure all resources served from same origin
- No API calls to third parties (by design)

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev/guide/

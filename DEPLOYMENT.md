# SapaSafe Deployment Guide

This guide provides instructions for deploying SapaSafe to different platforms.

## Build the Application

First, build the application:

```bash
cd apps/web
npm install
npm run build
```

This will generate static files in the `out/` directory.

## Deployment Options

### 1. Netlify (Current)

The app is configured for Netlify with `netlify.toml`. Simply connect your repository to Netlify and it will deploy automatically.

### 2. Vercel

Create a `vercel.json` file in the root:

```json
{
  "buildCommand": "cd apps/web && npm install && npm run build",
  "outputDirectory": "apps/web/out",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3. GitHub Pages

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: apps/web/package-lock.json
    
    - name: Install dependencies
      run: |
        cd apps/web
        npm ci
    
    - name: Build
      run: |
        cd apps/web
        npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./apps/web/out
```

### 4. Firebase Hosting

Create `firebase.json`:

```json
{
  "hosting": {
    "public": "apps/web/out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 5. AWS S3 + CloudFront

1. Upload the contents of `apps/web/out/` to an S3 bucket
2. Configure CloudFront with the S3 bucket as origin
3. Set up error pages to redirect to `/index.html`

### 6. Any Static Hosting Provider

The app is now a pure static site. You can deploy the contents of `apps/web/out/` to any static hosting provider.

## Key Features

- ✅ **Static Export** - No server-side rendering required
- ✅ **Client-side Routing** - All navigation handled by React Router
- ✅ **No Serverless Functions** - Pure static files
- ✅ **Cross-platform** - Works on any static hosting provider
- ✅ **Fast Loading** - Optimized static assets

## Troubleshooting

### MIME Type Errors
If you see MIME type errors, ensure your hosting provider serves:
- `.js` files as `application/javascript`
- `.css` files as `text/css`
- `.woff2` files as `font/woff2`

### Routing Issues
If direct URLs don't work, ensure your hosting provider redirects all routes to `/index.html` for client-side routing.

### Build Errors
If you get build errors about `generateStaticParams`, ensure you're using the static export configuration in `next.config.js`.

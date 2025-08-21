# Netlify Deployment Guide

## Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Netlify"
   git push
   ```

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Connect GitHub account
   - Select your repository
   - Set build settings:
     - **Base directory:** `apps/web`
     - **Build command:** `npm run build`
     - **Publish directory:** `out`

3. **Environment Variables (Optional)**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_NETWORK=alfajores
   ```

4. **Deploy!** 🚀

## Configuration Files Created:
- `netlify.toml` - Build settings and redirects
- `next.config.js` - Static export enabled
- `package.json` - Build scripts updated

Your app will be live at `https://your-site-name.netlify.app`

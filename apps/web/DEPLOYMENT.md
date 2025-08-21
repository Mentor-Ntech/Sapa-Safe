# SapaSafe Netlify Deployment Guide

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings**
   - **Base directory:** `apps/web`
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
   - **Node version:** `18`

4. **Environment Variables (Optional)**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_NETWORK=alfajores
   ```

5. **Deploy!**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Option 2: Manual Deploy

1. **Build locally**
   ```bash
   cd apps/web
   npm run build
   ```

2. **Deploy to Netlify**
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Login: `netlify login`
   - Deploy: `netlify deploy --dir=out --prod`

## ⚙️ Configuration Files

### `netlify.toml`
- Build settings and redirects
- Security headers
- Cache optimization

### `next.config.js`
- Static export enabled
- Image optimization disabled for static hosting
- Webpack configuration for blockchain dependencies

## 🔧 Environment Variables

Set these in Netlify dashboard:

```env
# Network Configuration
NEXT_PUBLIC_NETWORK=alfajores

# Contract Addresses (if needed)
NEXT_PUBLIC_VAULT_FACTORY_ADDRESS=0x7b6daCea811fd2704911E05c794CE08bF24430f4
NEXT_PUBLIC_TOKEN_REGISTRY_ADDRESS=0xa54286F049A9d8A8867707E3b2E958AD49Bdd30B
NEXT_PUBLIC_PENALTY_MANAGER_ADDRESS=0x92B16Fd77CDE4e27DEff8F9b2975a6a57C0b789b
```

## 🐛 Troubleshooting

### Build Errors
- **Node version:** Ensure Node.js 18+ is used
- **Dependencies:** Run `npm install` before build
- **Memory:** Increase build memory if needed

### Runtime Errors
- **Wallet connection:** Ensure HTTPS is enabled
- **Contract calls:** Verify network configuration
- **CORS:** Check if API endpoints are accessible

### Performance
- **Bundle size:** Check for large dependencies
- **Images:** Optimize images for web
- **Caching:** Verify cache headers are working

## 📱 Custom Domain

1. **Add custom domain in Netlify**
   - Go to Site settings > Domain management
   - Add your domain
   - Follow DNS instructions

2. **SSL Certificate**
   - Netlify provides free SSL
   - Automatically configured

## 🔄 Continuous Deployment

- **Automatic:** Every push to main branch triggers deploy
- **Preview:** Pull requests get preview deployments
- **Rollback:** Easy rollback to previous versions

## 📊 Monitoring

- **Build logs:** Available in Netlify dashboard
- **Analytics:** Enable Netlify Analytics
- **Forms:** Handle form submissions
- **Functions:** Serverless functions if needed

## 🚨 Important Notes

1. **Static Export:** App is exported as static files
2. **No Server:** No server-side rendering
3. **Client-side:** All blockchain interactions are client-side
4. **Wallet Required:** Users need MetaMask or similar wallet
5. **Network:** Configured for Celo Alfajores testnet

## 🎯 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] Build successful
- [ ] Site accessible
- [ ] Wallet connection works
- [ ] Contract interactions work
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics enabled (optional)

Your SapaSafe app is now live on Netlify! 🎉

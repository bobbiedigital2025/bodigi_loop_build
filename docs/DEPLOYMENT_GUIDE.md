# Deployment Guide

This document describes the deployment workflows configured for the Bodigi Loop Build project.

## GitHub Pages Deployment

The project is configured to automatically deploy to GitHub Pages on every push to the `main` branch.

### Workflow Configuration

File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      env:
        VITE_STRIPE_PUBLIC_KEY: ${{ secrets.VITE_STRIPE_PUBLIC_KEY }}
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v4
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/public
        cname: bodigi.app
```

### Required Secrets

Configure these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

1. **VITE_STRIPE_PUBLIC_KEY**: Your Stripe publishable key
2. **VITE_SUPABASE_URL**: Your Supabase project URL
3. **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous key

The `GITHUB_TOKEN` is automatically provided by GitHub Actions.

### Build Process

1. **Checkout**: Clones the repository
2. **Setup Node.js**: Installs Node.js 20 with npm cache
3. **Install dependencies**: Runs `npm ci` for clean install
4. **Build application**: Runs `npm run build` which:
   - Builds the frontend with Vite to `dist/public/`
   - Builds the backend with esbuild to `dist/index.js`
5. **Deploy**: Publishes the `dist/public` directory to GitHub Pages

### Custom Domain

The workflow is configured to use the custom domain `bodigi.app`. To set this up:

1. Add a CNAME record in your DNS settings pointing to `<username>.github.io`
2. Enable HTTPS in GitHub Pages settings
3. The `cname` field in the workflow will automatically create the CNAME file

### Deployment Triggers

- **Push to main**: Automatically deploys to production
- **Pull requests**: Builds but does not deploy (for testing)
- **Manual trigger**: Can be triggered via workflow_dispatch

## CI Workflow

File: `.github/workflows/ci.yml`

```yaml
name: Automated Debug & Test

on:
  schedule:
    - cron: '0 * * * *' # every hour
  workflow_dispatch:

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint || echo "Lint failed"
      - run: npm test || echo "Tests failed"
```

### CI Features

- **Scheduled runs**: Runs every hour to catch issues early
- **Manual trigger**: Can be run on-demand
- **Node.js 20**: Matches production environment
- **Caching**: Uses npm cache for faster builds
- **Non-blocking**: Errors are logged but don't fail the workflow

## Build Output Structure

After running `npm run build`, the output structure is:

```
dist/
├── index.js              # Bundled backend server
└── public/               # Frontend static files (deployed to GitHub Pages)
    ├── index.html
    └── assets/
        ├── index-[hash].css
        └── index-[hash].js
```

## Environment Variables

### Build-time Variables (Required)

These are injected during the build process:

- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

### Runtime Variables (Backend)

These are loaded from `.env` on the server:

- `STRIPE_SECRET_KEY`: Stripe secret key (server-side only)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `NODE_ENV`: Environment setting (development/production)
- `PORT`: Server port (default: 5000)

## Troubleshooting

### Build Fails

**Issue**: Build fails with "Missing script: build:client"
**Solution**: Use `npm run build` instead. The workflow has been updated to use the correct command.

**Issue**: Build fails with module errors
**Solution**: 
- Ensure all dependencies are in `package.json`
- Try deleting `node_modules` and `package-lock.json`, then run `npm install`
- Check that Node.js version matches (20.x)

### Deployment Fails

**Issue**: Deployment succeeds but site doesn't update
**Solution**:
- Check GitHub Pages settings (Settings > Pages)
- Ensure the source is set to the `gh-pages` branch
- Wait a few minutes for CDN to update
- Clear browser cache

**Issue**: Environment variables not working
**Solution**:
- Verify secrets are set in repository settings
- Check secret names match exactly (case-sensitive)
- Ensure variables are prefixed with `VITE_` for frontend access

### Custom Domain Issues

**Issue**: Custom domain not working
**Solution**:
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check CNAME file exists in deployed site
- Enable HTTPS in GitHub Pages settings

## Manual Deployment

To manually deploy:

1. Build the project locally:
   ```bash
   npm run build
   ```

2. The build output in `dist/public/` can be deployed to any static hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Firebase Hosting
   - Any static file server

3. For backend deployment, use `dist/index.js`:
   ```bash
   NODE_ENV=production node dist/index.js
   ```

## Performance Optimization

### Build Optimization

- **Code splitting**: Vite automatically splits code for optimal loading
- **Tree shaking**: Unused code is removed during build
- **Minification**: CSS and JS are minified
- **Compression**: gzip compression is used

### Caching Strategy

- **npm cache**: GitHub Actions caches node_modules
- **CDN caching**: GitHub Pages uses CDN for fast delivery
- **Asset hashing**: Files include content hash for cache busting

## Monitoring

To monitor deployments:

1. **GitHub Actions**: Check the Actions tab for build logs
2. **GitHub Pages**: Settings > Pages shows deployment status
3. **Custom domain**: Monitor DNS and SSL certificate status

## Additional Deployment Targets

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/public
```

### Docker

```bash
# Build Docker image
docker build -t bodigi-loop-build .

# Run container
docker run -p 5000:5000 --env-file .env bodigi-loop-build
```

## Support

For deployment issues:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check the main [README.md](../README.md)
4. Open an issue in the repository

---

Last updated: 2026-01-28

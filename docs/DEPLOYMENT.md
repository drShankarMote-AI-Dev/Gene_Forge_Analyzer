# Deployment Guide

This guide covers deploying Gene Forge Analyzer to various platforms.

## Prerequisites

- Docker installed (for containerized deployment)
- Node.js >= 16.0.0
- Account on your chosen platform

## Local Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t gene-forge-analyzer .

# Run the container
docker run -p 5173:5173 gene-forge-analyzer

# Access the application
# Open http://localhost:5173 in your browser
```

### Using Docker Compose

```bash
# Start the service
docker-compose up -d

# Stop the service
docker-compose down

# View logs
docker-compose logs -f gene-forge-analyzer
```

## Cloud Deployment

### Vercel (Recommended for Vite apps)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel

# Preview the deployment
vercel --prod
```

**vercel.json** configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=dist
```

**netlify.toml** configuration:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

```bash
# Build the application
npm run build

# Deploy using GitHub Pages action
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/gene-forge-analyzer/',
  // ... rest of config
})
```

### Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag the image
docker tag gene-forge-analyzer yourusername/gene-forge-analyzer:latest
docker tag gene-forge-analyzer yourusername/gene-forge-analyzer:1.0.0

# Push to Docker Hub
docker push yourusername/gene-forge-analyzer:latest
docker push yourusername/gene-forge-analyzer:1.0.0
```

Then anyone can run:
```bash
docker run -p 5173:5173 yourusername/gene-forge-analyzer
```

### AWS Deployment

#### Using ECS with Docker

1. Create ECR repository
2. Push Docker image to ECR
3. Create ECS task definition
4. Deploy with ECS service

#### Using S3 + CloudFront

```bash
# Build the app
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Google Cloud Platform (GCP)

```bash
# Install gcloud CLI
# Initialize
gcloud init

# Build and push to Cloud Build
gcloud builds submit --tag gcr.io/your-project/gene-forge-analyzer

# Deploy to Cloud Run
gcloud run deploy gene-forge-analyzer \
  --image gcr.io/your-project/gene-forge-analyzer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5173
```

### Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name gene-forge-rg --location eastus

# Create App Service plan
az appservice plan create --name gene-forge-plan --resource-group gene-forge-rg --is-linux --sku F1

# Create web app
az webapp create --resource-group gene-forge-rg --plan gene-forge-plan --name gene-forge-analyzer

# Deploy
az webapp deployment source config --resource-group gene-forge-rg --name gene-forge-analyzer --repo-url https://github.com/yourusername/gene-forge-analyzer --branch main --manual-integration
```

## Environment Variables

Create a `.env.production` file for production settings:

```env
NODE_ENV=production
VITE_API_URL=https://api.example.com
```

## Performance Optimization

1. **Enable Gzip compression** in your web server
2. **Use CDN** for static assets
3. **Enable caching headers** for optimal performance
4. **Monitor bundle size** - check with `npm run build`

## Monitoring & Logging

- Set up application monitoring (e.g., Sentry, LogRocket)
- Monitor error rates and user experience
- Set up alerting for critical issues

## Security Checklist

- [ ] Use HTTPS for all connections
- [ ] Keep dependencies updated
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Regular security audits

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173  # Windows
```

### Docker Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t gene-forge-analyzer .
```

### Application Not Responding
1. Check logs: `docker-compose logs`
2. Verify port mappings
3. Check environment variables
4. Restart the container

## Support

For deployment issues:
- Check platform-specific documentation
- Open an GitHub issue
- Consult the troubleshooting section
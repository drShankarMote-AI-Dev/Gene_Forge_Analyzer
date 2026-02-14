# ================================
# Frontend Dockerfile (Production)
# Gene Forge Analyzer v2.0.0
# ================================

# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS build-stage

# Metadata
LABEL maintainer="drShankarMote-AI-Dev"
LABEL version="2.0.0"
LABEL description="Gene Forge Analyzer Frontend"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy source files
COPY . .

# Build application
RUN npm run build

# ============================================
# Stage 2: Production Stage with Nginx
# ============================================
FROM nginx:1.25-alpine AS production-stage

# Metadata
LABEL maintainer="drShankarMote-AI-Dev"
LABEL version="2.0.0"

# Install curl for health checks
RUN apk add --no-cache curl

# Create nginx user directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Copy build artifacts from build stage
COPY --from=build-stage --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

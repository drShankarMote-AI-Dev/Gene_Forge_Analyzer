# Docker Configuration Guide

## Overview
Gene Forge Analyzer is configured with optimized Docker setup for secure, efficient containerization.

## Quick Start

### Build and Run with Docker Compose
```bash
# Build the image
docker compose build

# Run the container
docker compose up -d

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

### Build and Run with Docker (standalone)
```bash
# Build the image
docker build -t gene-forge-analyzer:latest .

# Run the container
docker run -p 5173:5173 --name gene-forge-analyzer gene-forge-analyzer:latest

# Access the application
# Open http://localhost:5173 in your browser
```

## Docker Configuration Improvements

### Dockerfile Optimizations
1. **Multi-stage Build**: Separates build dependencies from production image (reduces image size)
2. **Production-only Dependencies**: Uses `npm ci --only=production` to exclude dev dependencies
3. **Non-root User**: Runs container as unprivileged `nextjs` user (UID: 1001) for security
4. **Cache Clearing**: Clears npm cache to reduce image size
5. **Proper Permissions**: Sets correct ownership for built files

### Docker Compose Enhancements
1. **Security Options**:
   - `no-new-privileges:true`: Prevents privilege escalation
   - `cap_drop: ALL`: Drops all capabilities
   - `cap_add: NET_BIND_SERVICE`: Only adds required capability for port binding
   - `read_only: true`: Mounts filesystem as read-only

2. **Temporary Filesystem**:
   - `/tmp` mounted as tmpfs for temporary files

3. **Health Checks**:
   - Interval: 30s
   - Timeout: 10s
   - Start period: 40s (allows time for startup)
   - Retries: 3

4. **Network Configuration**:
   - Custom bridge network with defined subnet
   - Isolated container communication

5. **Metadata Labels**:
   - Container description and version tracking

## Development Mode

To run with hot-reload for development:

```bash
# Uncomment the volumes section in docker-compose.yml:
volumes:
  - .:/app
  - /app/node_modules
  - /app/dist

# Then run:
docker compose up -d
```

## Image Size Optimization

The multi-stage build significantly reduces the final image size:
- Builder stage: Creates optimized production build
- Production stage: Only includes runtime dependencies and built files
- No dev dependencies in final image
- Cache cleaned to minimize layers

## Ports

- **Internal Port**: 5173 (application runs here)
- **Exposed Port**: 5173 (accessible from host)

## Environment Variables

- `NODE_ENV=production`: Enables production optimizations

## Monitoring

### Check Container Status
```bash
docker compose ps
```

### View Logs
```bash
docker compose logs -f gene-forge-analyzer
```

### Health Status
```bash
docker compose ps
# Check "STATUS" column for health information
```

## Troubleshooting

### Container won't start
1. Check logs: `docker compose logs gene-forge-analyzer`
2. Verify port 5173 is not in use: `netstat -ano | findstr :5173`
3. Rebuild without cache: `docker compose build --no-cache`

### Port already in use
Change the port mapping in docker-compose.yml:
```yaml
ports:
  - "8080:5173"  # Access via localhost:8080
```

### Permission denied errors
Ensure non-root user permissions are correctly set (already configured in Dockerfile)

## Best Practices Implemented

✅ Multi-stage builds for smaller images
✅ Non-root user execution
✅ Health checks for auto-restart
✅ Security capabilities limits
✅ Read-only filesystem
✅ Network isolation
✅ Proper dependency caching
✅ Container metadata labels
✅ Production-optimized configuration

## Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Container Security](https://docs.docker.com/engine/security/)

# Docker Build Commands Reference

## Quick Build

### Linux/macOS
```bash
./build-docker.sh
```

### Windows (PowerShell)
```powershell
.\build-docker.bat
```

### Manual Build (All Platforms)
```bash
docker build -t gene-forge-analyzer:latest .
```

---

## Common Docker Commands

### Build Image

#### Standard Build (recommended)
```bash
docker build -t gene-forge-analyzer:latest .
```

#### Build with no cache (fresh install)
```bash
docker build -t gene-forge-analyzer:latest . --no-cache
```

#### Build with progress output
```bash
docker build -t gene-forge-analyzer:latest . --progress=plain
```

#### Build specific Dockerfile
```bash
docker build -t gene-forge-analyzer:latest -f Dockerfile .
```

---

### Run Container

#### Basic run
```bash
docker run -p 5173:5173 gene-forge-analyzer:latest
```

#### Run in background (detached)
```bash
docker run -d -p 5173:5173 --name gene-forge gene-forge-analyzer:latest
```

#### Run with custom environment
```bash
docker run -p 5173:5173 -e NODE_ENV=production gene-forge-analyzer:latest
```

#### Run with volume mount (for development)
```bash
docker run -p 5173:5173 -v $(pwd):/app gene-forge-analyzer:latest
```

---

### Container Management

#### List running containers
```bash
docker ps
```

#### List all containers (including stopped)
```bash
docker ps -a
```

#### View container logs
```bash
docker logs <container-id>
```

#### View live logs
```bash
docker logs -f <container-id>
```

#### Stop container
```bash
docker stop <container-id>
```

#### Start container
```bash
docker start <container-id>
```

#### Remove container
```bash
docker rm <container-id>
```

#### Remove container forcefully
```bash
docker rm -f <container-id>
```

---

### Image Management

#### List images
```bash
docker images
```

#### Remove image
```bash
docker rmi gene-forge-analyzer:latest
```

#### Tag image
```bash
docker tag gene-forge-analyzer:latest gene-forge-analyzer:v1.0.0
```

#### Push to registry
```bash
docker push username/gene-forge-analyzer:latest
```

---

## Docker Compose Commands

### Build and Run
```bash
docker-compose up --build
```

### Run in background
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### Rebuild services
```bash
docker-compose build --no-cache
```

### Execute command in running container
```bash
docker-compose exec gene-forge-analyzer sh
```

---

## Health Checks

### Check container health
```bash
docker inspect <container-id> | grep -A 5 "Health"
```

### Manual health check
```bash
curl http://localhost:5173/
```

---

## Debugging

### Inspect image
```bash
docker inspect gene-forge-analyzer:latest
```

### View image layers
```bash
docker history gene-forge-analyzer:latest
```

### Interactive shell in running container
```bash
docker exec -it <container-id> /bin/sh
```

### Build with interactive shell
```bash
docker run -it gene-forge-analyzer:latest /bin/sh
```

---

## Performance

### View image size
```bash
docker images | grep gene-forge-analyzer
```

### View disk usage
```bash
docker system df
```

### Prune unused images
```bash
docker image prune
```

### Prune all unused data
```bash
docker system prune
```

---

## Network

### Create custom network
```bash
docker network create gene-forge-network
```

### Run container on network
```bash
docker run -p 5173:5173 --network gene-forge-network --name gene-forge gene-forge-analyzer:latest
```

### List networks
```bash
docker network ls
```

---

## Build Statistics

### Expected Build Time
- **First build**: 2-3 minutes (installs all dependencies)
- **Subsequent builds**: 30-60 seconds (uses layer cache)

### Expected Image Size
- **Builder stage**: ~500MB (discarded in final image)
- **Final image**: ~200-250MB

### Layer Cache
Docker caches layers, so:
1. `FROM node:20-alpine` - cached if unchanged
2. `COPY package*.json` - cached unless files change
3. `npm ci` - only re-runs if package files change
4. `COPY . .` - only needed for source changes
5. `npm run build` - only re-runs if source changes

---

## Troubleshooting

### Build fails with "npm: not found"
**Cause**: Dependencies not installed
**Solution**: Check Dockerfile RUN command includes `npm ci`

### Port already in use
**Cause**: Port 5173 is in use
**Solution**: Use different port:
```bash
docker run -p 8080:5173 gene-forge-analyzer:latest
# Access at http://localhost:8080
```

### Out of disk space
**Cause**: Old images and containers accumulate
**Solution**: Clean up:
```bash
docker system prune -a
```

### Container exits immediately
**Cause**: Check logs:
```bash
docker logs <container-id>
```

### Permission denied
**Solution**: Add user to docker group (Linux):
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## Production Deployment

### Tag for registry
```bash
docker tag gene-forge-analyzer:latest myregistry.com/gene-forge-analyzer:1.0.0
```

### Push to Docker Hub
```bash
docker login
docker push myusername/gene-forge-analyzer:latest
```

### Deploy on server
```bash
docker pull myusername/gene-forge-analyzer:latest
docker run -d -p 80:5173 \
  --restart unless-stopped \
  --name gene-forge \
  myusername/gene-forge-analyzer:latest
```

---

## Useful Aliases

### Add to ~/.bashrc or ~/.zshrc
```bash
alias dps="docker ps"
alias dpsa="docker ps -a"
alias dls="docker images"
alias dlogs="docker logs -f"
alias dbuild="docker build -t gene-forge-analyzer:latest ."
alias drun="docker run -p 5173:5173 gene-forge-analyzer:latest"
alias dstop="docker stop"
alias drm="docker rm"
alias drmi="docker rmi"
alias dclean="docker system prune -a"
```

---

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

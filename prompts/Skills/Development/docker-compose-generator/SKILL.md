---
name: docker-compose-generator
description: Generate robust Docker Compose and Dockerfile configurations for full-stack applications. Use this skill when asked to containerize an application, set up a development environment, or prepare for production deployment using Docker.
---

# Docker Compose Configuration Generator

This skill focuses on containerizing applications effectively, prioritizing security, multi-stage builds, performance, and best practices for Docker Compose files.

## Guidelines

When creating Docker environments, follow these rules:

1. **Multi-Stage Builds**: Use multi-stage `Dockerfile`s to separate build environments from runtime environments. This reduces the final image size significantly.
2. **Minimal Base Images**: Prefer `alpine`, `distroless`, or `slim` tags for base images to minimize vulnerabilities.
3. **Non-Root User**: Never run the application as `root` inside the container unless strictly necessary. Switch to a less privileged user.
4. **Environment Variables**: Use `.env` files and `environment` properties in `docker-compose.yml` to inject configuration at runtime.
5. **Caching**: Optimize `COPY` and `RUN` instructions to leverage Docker's build cache effectively (e.g., copy `package.json` before copying the rest of the source code).
6. **Volumes**: Use named volumes for persistent data (databases) and bind mounts for local development (hot-reloading).
7. **Networking**: Ensure services are attached to custom networks to control communication securely. Use `depends_on` and health checks to ensure proper startup sequencing.

## Template

Provide responses in this structure:

### 1. `Dockerfile`
Provide a robust multi-stage `Dockerfile` for the primary application (e.g., Node.js, Go, Python). Include comments explaining the stages.

```dockerfile
# Stage 1: Build environment
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine AS runner
WORKDIR /app
# Run as non-root user
USER node
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. `docker-compose.yml`
Provide the complete Compose file defining the services, networks, and volumes.

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
```

### 3. Usage Instructions
Include instructions on how to start the environment:
- Create `.env` file containing variables (provide an example `.env.example`).
- Run `docker-compose up -d --build`.

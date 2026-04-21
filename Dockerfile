# syntax=docker/dockerfile:1.7
# Multi-stage build for the Son Nguyen portfolio (Vite static site → nginx).
# Author: Son Nguyen

# ---------- Stage 1: build the static bundle with Vite ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the source and build.
COPY . .
RUN npm run build

# ---------- Stage 2: serve with nginx ----------
FROM nginx:1.27-alpine AS runtime

# Non-root friendly nginx image; copy our server config and the built assets.
COPY project-config/nginx.portfolio.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]

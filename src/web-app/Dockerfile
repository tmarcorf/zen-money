# ============================================================
# ZenMoney Web App — React + Vite + TypeScript Frontend
# Multi-stage build: Node.js → Nginx Alpine (lightweight)
# ============================================================

# ---- Build Stage ----
FROM node:22-alpine AS build

# Create non-root user early to run builds safely
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy package manifests first for layer caching
COPY package.json package-lock.json* ./

# Install dependencies with clean install (respects lockfile)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the app; VITE_API_URL is injected at build time
ARG VITE_API_URL=http://localhost:7109
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---- Runtime Stage ----
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create non-root user and fix ownership
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html \
    && chown -R appuser:appgroup /var/cache/nginx \
    && chown -R appuser:appgroup /var/run \
    && touch /var/run/nginx.pid \
    && chown -R appuser:appgroup /var/run/nginx.pid

# Run nginx as non-root
USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

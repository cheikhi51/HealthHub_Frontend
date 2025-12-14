# Stage de build
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Clean install dependencies (silent to reduce logs)
RUN npm ci --silent --no-audit --progress=false

# Copy source code
COPY . .

# Build the application

RUN npm run build

# Verify build output exists
RUN ls -la /app/dist

# Stage de production
FROM nginx:alpine

# Install curl for health checks (optional)
RUN apk add --no-cache curl

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
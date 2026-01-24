FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy setup and seed scripts
COPY --from=builder /app/setup-tables-pg.js ./
COPY --from=builder /app/seed-data-pg.js ./

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]

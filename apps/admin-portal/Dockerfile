# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install minimal dependencies
RUN apk add --no-cache libc6-compat

# Copy package files for dependency installation
COPY package.json yarn.lock ./
COPY apps/admin-portal/package.json ./apps/admin-portal/package.json
COPY turbo.json ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install build essentials
RUN apk add --no-cache libc6-compat
RUN yarn global add turbo

# Copy source code and dependencies
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin-portal/node_modules ./apps/admin-portal/node_modules

# Build the application
RUN yarn turbo build --filter=admin-portal

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Set the working directory
WORKDIR /app/apps/admin-portal

# Copy only the necessary built files and dependencies
COPY --from=builder --chown=appuser:nodejs /app/apps/admin-portal/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/apps/admin-portal/package.json ./
COPY --from=deps --chown=appuser:nodejs /app/apps/admin-portal/node_modules ./node_modules

# Switch to non-root user
USER appuser

# Expose the port your app runs on (adjust if needed)
EXPOSE 4173

# Start the application in preview mode
CMD ["yarn", "preview"]

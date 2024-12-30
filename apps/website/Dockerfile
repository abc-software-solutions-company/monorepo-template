# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install only the necessary build dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json yarn.lock ./
COPY apps/website/package.json ./apps/website/package.json
COPY turbo.json ./

# Install dependencies with specific flags to optimize size
RUN yarn install --frozen-lockfile --production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache libc6-compat
RUN yarn global add turbo

# Copy source files and dependencies
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/website/node_modules ./apps/website/node_modules

# Run turbo prune to get only necessary files
RUN turbo prune website --docker

# Build the website
RUN yarn turbo build --filter=website

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install only runtime dependencies
RUN apk add --no-cache curl

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set the working directory
WORKDIR /app/apps/website

# Copy only the necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ../node_modules

# Switch to non-root user
USER nextjs

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]

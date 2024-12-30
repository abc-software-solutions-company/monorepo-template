# Stage 1: Dependencies
FROM node:21-alpine AS deps
WORKDIR /app

# Install essential build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy only package files needed for installation
COPY .gitignore .gitignore
COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies
RUN yarn set version berry
RUN yarn install --frozen-lockfile --production

# Stage 2: Builder
FROM node:21-alpine AS builder
WORKDIR /app

# Install build essentials
RUN apk add --no-cache python3 make g++ libc6-compat
RUN yarn global add turbo

# Copy source files
COPY . .
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

# Build the application
RUN yarn turbo build --filter=api

# Stage 3: Production
FROM node:21-alpine AS runner
WORKDIR /app

# Install only the necessary runtime packages
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

# Copy only necessary files from builder
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/package.json ./apps/api/
COPY --from=deps --chown=nestjs:nestjs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/migrations ./apps/api/migrations

# Switch to non-root user
USER nestjs

# Set the working directory to the api folder
WORKDIR /app/apps/api

# Start the application
CMD ["sh", "-c", "yarn migration:run && node dist/main.js"]

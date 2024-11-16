# Base stage
FROM node:20-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
 
# Builder stage
FROM base AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune admin-portal --docker
 
# Installer stage
FROM base AS installer
WORKDIR /app
 
# Copy pruned lockfile and package.json's
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY turbo.json turbo.json
RUN yarn install
 
# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
 
# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
 
RUN yarn turbo build --filter=admin-portal
 
FROM base AS runner
WORKDIR /app

COPY --from=installer /app .

# Start web application
CMD ["/bin/sh", "-c", "cd apps/admin-portal && yarn preview"]

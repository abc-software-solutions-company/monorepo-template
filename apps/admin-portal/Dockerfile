# Base stage
FROM node:20-alpine AS base
RUN apk update && apk add --no-cache libc6-compat curl && rm -rf /var/cache/apk/*

# Builder stage
FROM base AS builder
WORKDIR /app
RUN yarn global add turbo@2.3.3
COPY . .
RUN turbo prune admin-portal --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# Copy pruned lockfile and package.json's
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY turbo.json turbo.json
RUN yarn install && yarn cache clean

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN yarn turbo build --filter=admin-portal && rm -rf node_modules/.cache/turbo/*

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 vite
USER vite

# COPY --from=installer /app .
COPY --from=installer --chown=vite:nodejs /app/apps/admin-portal/dist ./apps/admin-portal/dist
COPY --from=installer --chown=vite:nodejs /app/apps/admin-portal/.env ./apps/admin-portal/.env
COPY --from=installer --chown=vite:nodejs /app/apps/admin-portal/package.json ./apps/admin-portal/package.json
COPY --from=installer --chown=vite:nodejs /app/apps/admin-portal/public ./apps/admin-portal/public
RUN yarn global add vite@6.0.7 && yarn cache clean

# Start web application
CMD ["/bin/sh", "-c", "cd apps/admin-portal && yarn preview"]

FROM node:21-alpine AS base
RUN apk update && apk add --no-cache curl

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Install dependencies required for bcrypt
RUN apk add --no-cache python3 make g++
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated sub workspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn set version berry
RUN yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN yarn turbo build --filter=api

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Automatically leverage output traces to reduce image size
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/tsconfig.json ./tsconfig.json
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/.env ./.env
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules

# Correct the path to the entry point
CMD ["/bin/sh", "-c", "yarn migration:run && node dist/main.js"]

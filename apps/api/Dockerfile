FROM node:21-alpine AS base
RUN apk update && apk add --no-cache curl libc6-compat python3 make g++ && rm -rf /var/cache/apk/*

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS builder
WORKDIR /app
RUN yarn global add turbo@2.3.3
COPY . .
RUN turbo prune api --docker

# Add lockfile and package.json's of isolated sub workspace
FROM base AS installer
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn set version berry
RUN yarn install && yarn cache clean

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN yarn turbo build --filter=api && rm -rf node_modules/.cache/turbo/*

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

USER nestjs
COPY --from=installer --chown=nestjs:nodejs /app/apps/api /app/apps/api
COPY --from=installer --chown=nestjs:nodejs /app/node_modules /app/apps/api/node_modules

# Excute migration
RUN cd apps/api && yarn migration:run

# Correct the path to the entry point
CMD ["/bin/sh", "-c", "cd apps/api && node dist/main.js"]

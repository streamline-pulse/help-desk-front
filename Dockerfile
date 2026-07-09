# syntax=docker.io/docker/dockerfile:1

FROM node:24-alpine AS base

# Install pnpm once in base
RUN npm install -g pnpm@9.15.4

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm i


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time variables (NEXT_PUBLIC_* are inlined by Next.js during `pnpm run build`).
# Override per environment via `docker build --build-arg` in CI if needed.
ARG HELP_DESK_API_URL=https://api.helpdesk.dev.streamline-pulse.com
ARG NEXT_PUBLIC_HELP_DESK_API_URL=https://api.helpdesk.dev.streamline-pulse.com

ENV HELP_DESK_API_URL=$HELP_DESK_API_URL
ENV NEXT_PUBLIC_HELP_DESK_API_URL=$NEXT_PUBLIC_HELP_DESK_API_URL

# Runtime secrets (NEXTAUTH_*, GOOGLE OAuth, router tokens) are injected by Kubernetes — not here.

RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Set environment variable
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3888
ENV HOSTNAME=0.0.0.0

# Runtime secrets (NEXTAUTH_*, GOOGLE OAuth, router tokens) are injected by Kubernetes.

CMD ["node", "server.js"]

# Make port $PORT available to the world outside this container
EXPOSE 3888
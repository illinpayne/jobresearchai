# ─── Base: system deps + pnpm ─────────────────────────────────────────────────
FROM node:22-alpine AS base

# Use corepack (ships with Node 22) instead of `npm install -g pnpm`
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Crawlee needs Chromium at both build-time (prisma generate) and runtime
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CRAWLEE_CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser

# ─── Install ALL deps (build needs devDeps) ───────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/jobs-service/package.json ./apps/jobs-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile && pnpm store prune

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/jobs-service ./apps/jobs-service
COPY packages/contracts ./packages/contracts

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter jobs-service exec prisma generate
RUN pnpm --filter jobs-service build

# ─── Prune to production deps only ───────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/jobs-service/package.json ./apps/jobs-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile --prod --no-optional && pnpm store prune

# ─── Production image ─────────────────────────────────────────────────────────
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Run as a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Workspace manifests (needed by pnpm at runtime for module resolution)
COPY pnpm-workspace.yaml package.json ./
COPY apps/jobs-service/package.json ./apps/jobs-service/
COPY packages/contracts/package.json ./packages/contracts/

# Production node_modules
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/jobs-service/node_modules ./apps/jobs-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

# Compiled output
COPY --from=builder /app/apps/jobs-service/dist ./apps/jobs-service/dist
COPY --from=builder /app/apps/jobs-service/prisma ./apps/jobs-service/prisma
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 50054
CMD ["node", "apps/jobs-service/dist/src/main"]
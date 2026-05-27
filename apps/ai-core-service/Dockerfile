# ─── Base ─────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

# Native addons (e.g. node-gyp deps) need build tools at install time
RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/ai-core-service/package.json ./apps/ai-core-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile && pnpm store prune

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/ai-core-service ./apps/ai-core-service
COPY packages/contracts ./packages/contracts

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter ai-core-service exec prisma generate
RUN pnpm --filter ai-core-service build

# ─── Production deps (needs build tools for native addons) ────────────────────
FROM base AS prod-deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/ai-core-service/package.json ./apps/ai-core-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile --prod && pnpm store prune

# ─── Production image — no build tools ───────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate \
 && addgroup -S appgroup && adduser -S appuser -G appgroup

COPY pnpm-workspace.yaml package.json ./
COPY apps/ai-core-service/package.json ./apps/ai-core-service/
COPY packages/contracts/package.json ./packages/contracts/

# Compiled node_modules with native binaries — no build tools needed
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/ai-core-service/node_modules ./apps/ai-core-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

COPY --from=builder /app/apps/ai-core-service/dist ./apps/ai-core-service/dist
COPY --from=builder /app/apps/ai-core-service/prisma ./apps/ai-core-service/prisma
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 50053
CMD ["node", "apps/ai-core-service/dist/src/main"]
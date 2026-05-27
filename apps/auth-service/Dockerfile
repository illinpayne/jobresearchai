# ─── Base ─────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

# argon2 needs build tools to compile its native addon
RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile && pnpm store prune

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/auth-service ./apps/auth-service
COPY packages/contracts ./packages/contracts

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter auth-service exec prisma generate
RUN pnpm --filter auth-service build

# ─── Production deps (needs build tools for argon2) ───────────────────────────
FROM base AS prod-deps
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile --prod && pnpm store prune

# ─── Production image — no build tools ───────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate \
 && addgroup -S appgroup && adduser -S appuser -G appgroup

COPY pnpm-workspace.yaml package.json ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages/contracts/package.json ./packages/contracts/

# Compiled node_modules with argon2 native binary — no build tools needed
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/auth-service/node_modules ./apps/auth-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=builder /app/apps/auth-service/prisma ./apps/auth-service/prisma
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 50051
CMD ["node", "apps/auth-service/dist/src/main"]
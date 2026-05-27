# ─── Base ─────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/storage-service/package.json ./apps/storage-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile && pnpm store prune

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/storage-service ./apps/storage-service
COPY packages/contracts ./packages/contracts

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter storage-service build

# ─── Production ───────────────────────────────────────────────────────────────
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/storage-service/package.json ./apps/storage-service/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile --prod && pnpm store prune

COPY --from=builder /app/apps/storage-service/dist ./apps/storage-service/dist
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 50052
CMD ["node", "apps/storage-service/dist/src/main"]
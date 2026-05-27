# ─── Base ─────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ─── Install dependencies ─────────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --frozen-lockfile && pnpm store prune

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/frontend ./apps/frontend

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter frontend build

# ─── Production ───────────────────────────────────────────────────────────────
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --frozen-lockfile --prod --no-optional && pnpm store prune

COPY --from=builder --chown=appuser:appgroup /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder --chown=appuser:appgroup /app/apps/frontend/public ./apps/frontend/public

RUN chown -R appuser:appgroup /app
USER appuser

WORKDIR /app/apps/frontend

EXPOSE 3000
CMD ["pnpm", "start"]
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

# Build-time env args
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WEBSOCKET_URL
ARG NEXT_PUBLIC_OAUTH_ID
ARG NEXT_PUBLIC_OAUTH_SECRET
ARG NEXT_PUBLIC_OAUTH_REDIRECT_PATH
ARG NEXT_PUBLIC_OAUTH_ROOT_URL
ARG NEXT_PUBLIC_OAUTH_API_URL
ARG NEXT_PUBLIC_STORAGE_URL

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WEBSOCKET_URL=$NEXT_PUBLIC_WEBSOCKET_URL
ENV NEXT_PUBLIC_OAUTH_ID=$NEXT_PUBLIC_OAUTH_ID
ENV NEXT_PUBLIC_OAUTH_SECRET=$NEXT_PUBLIC_OAUTH_SECRET
ENV NEXT_PUBLIC_OAUTH_REDIRECT_PATH=$NEXT_PUBLIC_OAUTH_REDIRECT_PATH
ENV NEXT_PUBLIC_OAUTH_ROOT_URL=$NEXT_PUBLIC_OAUTH_ROOT_URL
ENV NEXT_PUBLIC_OAUTH_API_URL=$NEXT_PUBLIC_OAUTH_API_URL
ENV NEXT_PUBLIC_STORAGE_URL=$NEXT_PUBLIC_STORAGE_URL

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
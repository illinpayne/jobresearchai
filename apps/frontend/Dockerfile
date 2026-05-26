FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0

# ─── Install dependencies ─────────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .
COPY apps/frontend/package.json ./apps/frontend/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/frontend ./apps/frontend
COPY apps/frontend/.env.production ./apps/frontend/.env.production

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter frontend build

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN npm install -g pnpm@9.0.0

WORKDIR /app/apps/frontend

COPY apps/frontend/package.json ./package.json
COPY apps/frontend/next.config.ts ./next.config.ts

RUN pnpm install --no-frozen-lockfile

COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
CMD ["pnpm", "start"]
FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/notification-service/package.json ./apps/notification-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/notification-service ./apps/notification-service
COPY packages/contracts ./packages/contracts
COPY packages/linters ./packages/linters

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter notification-service build

# ─── Production deps ──────────────────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/notification-service/package.json ./apps/notification-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile --prod

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-workspace.yaml .
COPY package.json .

COPY apps/notification-service/package.json ./apps/notification-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/notification-service/node_modules ./apps/notification-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

# built dist
COPY --from=builder /app/apps/notification-service/dist ./apps/notification-service/dist

# emails directory — react-email templates used at runtime
COPY --from=builder /app/apps/notification-service/emails ./apps/notification-service/emails

# contracts
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

ENV NODE_ENV=production

EXPOSE 3003
CMD ["node", "apps/notification-service/dist/src/main"]
FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/storage-service/package.json ./apps/storage-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/storage-service ./apps/storage-service
COPY packages/contracts ./packages/contracts
COPY packages/linters ./packages/linters

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter storage-service build

# ─── Production deps ──────────────────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/storage-service/package.json ./apps/storage-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile --prod

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-workspace.yaml .
COPY package.json .

COPY apps/storage-service/package.json ./apps/storage-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/storage-service/node_modules ./apps/storage-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

COPY --from=builder /app/apps/storage-service/dist ./apps/storage-service/dist
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

ENV NODE_ENV=production

EXPOSE 50052
CMD ["node", "apps/storage-service/dist/src/main"]
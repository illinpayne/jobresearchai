FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app
# argon2 needs build tools — only in installer/builder stages
RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/auth-service ./apps/auth-service
COPY packages/contracts ./packages/contracts
COPY packages/linters ./packages/linters

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter auth-service exec prisma generate
RUN pnpm --filter auth-service build

# ─── Production deps only ─────────────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app
# argon2 needs build tools to compile even for prod install
RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile --prod

# ─── Production image — no build tools ───────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@9.0.0

# copy only prod node_modules — no python/make/g++
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/auth-service/node_modules ./apps/auth-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

# copy manifests
COPY pnpm-workspace.yaml .
COPY package.json .
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages/contracts/package.json ./packages/contracts/

# built outputs
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=builder /app/apps/auth-service/prisma ./apps/auth-service/prisma
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

ENV NODE_ENV=production

EXPOSE 50051
CMD ["node", "apps/auth-service/dist/src/main"]
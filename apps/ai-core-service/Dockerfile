FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
RUN apk add --no-cache python3 make g++

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/ai-core-service/package.json ./apps/ai-core-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/ai-core-service ./apps/ai-core-service
COPY packages/contracts ./packages/contracts
COPY packages/linters ./packages/linters

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter ai-core-service exec prisma generate
RUN pnpm --filter ai-core-service build

# ─── Production deps ──────────────────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/ai-core-service/package.json ./apps/ai-core-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile --prod

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-workspace.yaml .
COPY package.json .

COPY apps/ai-core-service/package.json ./apps/ai-core-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/ai-core-service/node_modules ./apps/ai-core-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

COPY --from=builder /app/apps/ai-core-service/dist ./apps/ai-core-service/dist
COPY --from=builder /app/apps/ai-core-service/prisma ./apps/ai-core-service/prisma
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

ENV NODE_ENV=production

EXPOSE 50053
CMD ["node", "apps/ai-core-service/dist/src/main"]
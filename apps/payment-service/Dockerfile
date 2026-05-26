FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/payment-service/package.json ./apps/payment-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/payment-service ./apps/payment-service
COPY packages/contracts ./packages/contracts
COPY packages/linters ./packages/linters

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter payment-service exec prisma generate
RUN pnpm --filter payment-service build

# ─── Production deps ──────────────────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/payment-service/package.json ./apps/payment-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile --prod

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-workspace.yaml .
COPY package.json .

COPY apps/payment-service/package.json ./apps/payment-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/payment-service/node_modules ./apps/payment-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

COPY --from=builder /app/apps/payment-service/dist ./apps/payment-service/dist
COPY --from=builder /app/apps/payment-service/prisma ./apps/payment-service/prisma
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

ENV NODE_ENV=production

EXPOSE 50055
EXPOSE 5001
CMD ["node", "apps/payment-service/dist/src/main"]
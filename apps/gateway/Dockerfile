FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

# copy workspace manifests
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

# copy all package.json files (needed for pnpm workspace resolution)
COPY apps/gateway/package.json ./apps/gateway/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

# copy source
COPY apps/gateway ./apps/gateway
COPY packages/contracts ./packages/contracts
COPY packages/linters ./packages/linters

# build contracts first, then gateway
RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter gateway build

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/gateway/package.json ./apps/gateway/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile --prod

# copy built outputs only
COPY --from=builder /app/apps/gateway/dist ./apps/gateway/dist
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

ENV NODE_ENV=production

EXPOSE 5000
CMD ["node", "apps/gateway/dist/src/main"]
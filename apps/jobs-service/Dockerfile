FROM node:22-alpine AS base
RUN npm install -g pnpm@9.0.0
# crawlee needs chromium dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# ─── Install all dependencies ─────────────────────────────────────────────────
FROM base AS installer
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/jobs-service/package.json ./apps/jobs-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile

# ─── Build ────────────────────────────────────────────────────────────────────
FROM installer AS builder
WORKDIR /app

COPY apps/jobs-service ./apps/jobs-service
COPY packages/contracts ./packages/contracts
COPY packages/linters ./packages/linters

RUN pnpm --filter @jrai/contracts build
RUN pnpm --filter jobs-service exec prisma generate
RUN pnpm --filter jobs-service build

# ─── Production deps ──────────────────────────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app

COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .

COPY apps/jobs-service/package.json ./apps/jobs-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

RUN pnpm install --frozen-lockfile --prod

# ─── Production ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app

RUN npm install -g pnpm@9.0.0

# chromium needed at runtime for crawlee
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# tell crawlee/playwright to use system chromium
ENV CRAWLEE_CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY pnpm-workspace.yaml .
COPY package.json .

COPY apps/jobs-service/package.json ./apps/jobs-service/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/linters/package.json ./packages/linters/

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/jobs-service/node_modules ./apps/jobs-service/node_modules
COPY --from=prod-deps /app/packages/contracts/node_modules ./packages/contracts/node_modules

COPY --from=builder /app/apps/jobs-service/dist ./apps/jobs-service/dist
COPY --from=builder /app/apps/jobs-service/prisma ./apps/jobs-service/prisma
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/proto ./packages/contracts/proto

ENV NODE_ENV=production

EXPOSE 50054
CMD ["node", "apps/jobs-service/dist/src/main"]
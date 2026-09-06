FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS dependencies

RUN npm ci --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=1000 --fetch-retry-maxtimeout=120000

FROM dependencies AS build

COPY tsconfig.json ./
COPY eslint.config.js ./
COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./

ENV DATABASE_URL="postgresql://lifeos:lifeos@localhost:5432/lifeos?schema=public"

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/server.js"]
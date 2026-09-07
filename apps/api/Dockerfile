FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS dependencies

RUN npm install

FROM dependencies AS build

COPY tsconfig.json ./
COPY eslint.config.js ./
COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./

# Prisma needs DATABASE_URL at build time to generate the client
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

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

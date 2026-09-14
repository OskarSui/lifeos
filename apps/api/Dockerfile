FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci


FROM dependencies AS build

WORKDIR /app

COPY tsconfig.json ./
COPY eslint.config.js ./
COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npx prisma generate

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client

COPY --from=build /app/dist ./dist

COPY --from=build /app/prisma ./prisma

COPY prisma.config.ts ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/server.js"]
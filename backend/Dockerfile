FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN mkdir -p /app/uploads # Tworzenie folderu uploads

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]

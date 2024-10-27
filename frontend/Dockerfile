# Etap budowania (tylko dla produkcji, przy developerskim używamy innego trybu)
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Finalny obraz (dla wersji produkcyjnej)
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

# Ustawienie komendy na wersję produkcyjną lub developerską w docker-compose
CMD ["npm", "start"]

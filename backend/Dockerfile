#use official Node.js image as the base image
FROM node:22

WORKDIR /app

# Install Postgres client
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY drizzle.config.ts ./
RUN npm install
COPY ./drizzle ./drizzle
COPY ./src ./src
COPY ./wait-for-db.sh ./wait-for-db.sh
RUN chmod +x ./wait-for-db.sh

RUN npm run build

EXPOSE 3000
CMD ["sh", "./wait-for-db.sh", "db", "node", "dist/main.js"]
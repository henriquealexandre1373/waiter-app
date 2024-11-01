# building step
FROM node:18-alpine AS builder

WORKDIR /src
COPY package*.json ./
RUN yarn install

COPY . .

# finish step
FROM node:18-alpine

ARG APP_PORT
ENV PORT=$APP_PORT
ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app
COPY --from=builder /src .

EXPOSE ${PORT}

CMD ["yarn", "start:dev"]

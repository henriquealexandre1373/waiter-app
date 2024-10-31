FROM node:18-alpine

WORKDIR ./

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn install

EXPOSE 3001

CMD ["yarn", "start:dev"]

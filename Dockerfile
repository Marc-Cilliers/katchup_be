FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn db:gen

RUN yarn db:push

RUN yarn build

EXPOSE 8080

CMD yarn start
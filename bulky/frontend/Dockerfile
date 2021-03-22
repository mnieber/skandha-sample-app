FROM node:14-alpine

RUN mkdir /app
COPY . /app/src

WORKDIR /app/src
RUN yarn install

CMD yarn start
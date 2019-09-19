FROM node:10-alpine

WORKDIR /usr/app

RUN apk --no-cache add --virtual builds-deps build-base python 
COPY package.json .
RUN yarn install \
    && apk del builds-deps

COPY . .
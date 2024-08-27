FROM node:20.17.0-alpine AS build

WORKDIR /aviation/webapp

COPY package*.json yarn*.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=build /aviation/webapp/build/ /usr/share/nginx/html
COPY --from=build /aviation/webapp/docker/nginx.conf /etc/nginx/conf.d/default.conf

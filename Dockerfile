FROM node:12-alpine AS builder
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /micronutrient-support-tool
COPY package.json ./
RUN npm cache clean --force
RUN npm i
COPY . .
RUN node_modules/.bin/ng build --prod --aot --build-optimizer --vendor-chunk=true


FROM nginx:1.19.0-alpine
VOLUME /var/cache/nginx
COPY --from=builder /micronutrient-support-tool/dist/micronutrient-support-tool/ /usr/share/nginx/html
EXPOSE 80
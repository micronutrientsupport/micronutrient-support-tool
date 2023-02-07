FROM node:16 AS builder
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /micronutrient-support-tool
COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build:prod

FROM nginx:1.19.0-alpine
VOLUME /var/cache/nginx
COPY --from=builder /micronutrient-support-tool/dist/micronutrient-support-tool/ /usr/share/nginx/html
EXPOSE 80

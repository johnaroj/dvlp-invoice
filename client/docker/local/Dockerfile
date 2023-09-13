FROM node:18.16.0-alpine AS base

RUN npm install -g pnpm

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY  package.json pnpm-lock.yaml ./

RUN pnpm install  

COPY . ${APP_HOME}

CMD ["pnpm", "start"]
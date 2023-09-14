FROM node:18.16.0-alpine AS base

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY  package*.json ./

RUN npm install  

COPY . ${APP_HOME}

CMD ["npm", "start"]
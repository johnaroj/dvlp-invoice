FROM node:18.16.0-alpine AS base

LABEL name="dvlp-invoice"
LABEL license="MIT"
LABEL description="Invoice service"

ENV NODE_ENV=development

ARG APP_HOME=/app 

WORKDIR ${APP_HOME}

RUN  addgroup --system invoice \ 
    && adduser --system --ingroup invoice invoice 

COPY ./package*.json ./


RUN npm i 

COPY --chown=invoice:invoice . ${APP_HOME}

RUN chown invoice:invoice ${APP_HOME}

USER invoice

CMD ["npm", "run", "dev"]
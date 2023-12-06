FROM node:18.14.2 AS builder
RUN mkdir -p /app
WORKDIR /app
ADD . .

RUN npm uninstall bcrypt
RUN npm install bcrypt
RUN npm install
RUN npm run build

ARG STAGE
ENV STAGE ${STAGE}
ARG POSTGRES_HOST
ENV POSTGRES_HOST ${HOST}
ARG SWAGGER_USER
ENV SWAGGER_USER ${SWAGGER_USER}
ARG SWAGGER_PASSWORD
ENV SWAGGER_PASSWORD ${SWAGGER_PASSWORD}

CMD npm run typeorm migration:run;npm run start:prod
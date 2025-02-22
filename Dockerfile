# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:staging

# production stage
FROM node:lts-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/build /app/build
COPY --from=build-stage /app/server /app/server

RUN mv /app/build/index.html /app/build/home.html

WORKDIR /app/server

RUN npm install

ENV HOST=0.0.0.0 PORT=4000

EXPOSE ${PORT}
CMD ["node", "." ]

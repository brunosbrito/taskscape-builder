
FROM node:22 AS build

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

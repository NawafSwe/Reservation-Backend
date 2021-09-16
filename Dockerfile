
# syntax=docker/dockerfile:1
FROM node:current-alpine
ENV NODE_ENV=development
WORKDIR /usr/app
# coping package json and pcakage-lock into /usr/app
COPY "package.json" ./
COPY "package-lock.json" ./
COPY .env.development ./
COPY .env.testing ./

# installing packages
RUN npm install --development
# coping source code to our image
COPY . .
EXPOSE 6666
CMD ["npm","run","start:dev"]
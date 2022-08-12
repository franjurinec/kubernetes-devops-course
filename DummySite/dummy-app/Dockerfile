FROM node:18.2.0-bullseye-slim

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

COPY . .
CMD [ "node", "." ]
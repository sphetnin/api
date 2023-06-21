FROM node:18-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install -ci

COPY . .

EXPOSE 9000

CMD ["node", "server.js"]

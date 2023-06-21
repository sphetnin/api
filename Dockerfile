FROM node:18-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install -ci

COPY . .

EXPOSE 3333

CMD ["node", "server.js"]

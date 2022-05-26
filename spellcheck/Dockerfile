FROM node:16.4-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g spellchecker-cli
RUN npm install
COPY . .

ENTRYPOINT ["node","/app/index.js"]
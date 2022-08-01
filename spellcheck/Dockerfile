FROM node:16.4-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g spellchecker-cli@6.0.1
RUN npm install
COPY . .

ENTRYPOINT ["node","/app/index.js"]
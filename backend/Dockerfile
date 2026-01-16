FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose ports (API & Syslog)
EXPOSE 3000
EXPOSE 5140/udp

CMD ["node", "server.js"]
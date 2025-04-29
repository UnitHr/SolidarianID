# Use the official Node.js 20 image based on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

EXPOSE 4000

CMD ["npx", "pm2-runtime", "start", "server.js", "--name", "server_push"]

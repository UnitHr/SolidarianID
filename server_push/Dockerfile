# Use the official Node.js 20 image based on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (to leverage dependency caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

EXPOSE 4000

CMD ["npx", "pm2-runtime", "start", "server.js", "--name", "server_push"]

# Use the official Node.js 20 image based on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies specified in package.json
RUN npm install

# Copy the entire application source code to the working directory
COPY . .

# Expose port 3000 to allow external access to the app
EXPOSE 3000

# Define a build argument for the service name
ARG SERVICE_NAME

# Set an environment variable for the service name at runtime
ENV SERVICE_NAME=${SERVICE_NAME}

# Build the application for the specified microservice
RUN npm run build:${SERVICE_NAME}

# Start the server using the production build for the specified microservice
CMD ["sh", "-c", "npm run start:prod:${SERVICE_NAME}"]

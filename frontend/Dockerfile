# Use the official Node.js 18 image based on Alpine Linux
FROM node:18-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies specified in package.json
RUN npm install

# Copy all the application source code to the working directory
COPY . .

# Expose port 3005 to allow external access to the application
EXPOSE 3005

# Build the application
RUN npm run build
RUN npm run build:css

# Start the server using the production configuration
CMD ["npm", "run", "start:prod"]

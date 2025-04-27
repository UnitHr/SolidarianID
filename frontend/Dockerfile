# Use the official Node.js 20 image based on Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (to leverage dependency caching)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port where Vite runs
EXPOSE 5173

# Command to start the development server
# TODO: Use the prod commands
CMD ["npm", "run", "dev", "--", "--host"]

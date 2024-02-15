# Use an official Node runtime as a parent image
FROM node:21-alpine3.18
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) to the container
COPY package*.json ./

# Install any dependencies
RUN npm ci --only=production

# Bundle your app's source code inside the Docker image
COPY . .

# Your application's default port, expose it to the network
EXPOSE 3000

# Run the application
CMD ["npm", "dev"]
# Stage 1: Build the app
FROM node:18.20.4-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com \
    && npm cache clean --force \
    && npm install --prefer-offline --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the application (if using Next.js)
RUN npm run build

# Stage 2: Serve the app in a smaller image
FROM node:18.20.4-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Expose the port
EXPOSE 3312

# Start the application
CMD ["npm", "start"]

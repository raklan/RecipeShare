# Dockerfile
FROM node:20-alpine

# Install build tools for native modules
RUN apk add --no-cache make gcc g++ python3

# Create data directory
RUN mkdir -p /data && chown -R node:node /data

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (build native modules inside the container)
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Expose port
ENV PORT=2323
EXPOSE 2323

# Start the app
CMD ["node", "app.js"]

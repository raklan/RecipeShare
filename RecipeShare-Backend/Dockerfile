# Dockerfile
FROM node:20-alpine

RUN mkdir -p /data
VOLUME /data

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Expose the port Fly uses
ENV PORT=2323
EXPOSE 2323

# Start the app
CMD ["node", "app.js"]
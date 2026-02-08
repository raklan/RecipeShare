FROM node:20-alpine

# Build tools for native modules
RUN apk add --no-cache make gcc g++ python3 linux-headers

# Create /data for SQLite
RUN mkdir -p /data && chown -R node:node /data

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies inside container
RUN npm ci --only=production

# Force rebuild of better-sqlite3 inside container
RUN npm rebuild better-sqlite3 --build-from-source

# Copy the rest of the app
COPY . .

# Expose port
ENV PORT=2323
EXPOSE 2323

# Run as non-root
USER node

CMD ["node", "app.js"]

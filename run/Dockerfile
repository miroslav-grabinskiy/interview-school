# Use Node.js LTS version
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Copy .env.example to .env if it doesn't exist
COPY .env.example .env

# Build TypeScript code
RUN npm run build && \
    rm -rf src && \
    rm -rf node_modules/@types && \
    rm -rf node_modules/typescript

# Expose API port
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "start"]
FROM node:20-alpine

# Create app dir
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Expose port for internal network
EXPOSE 3000

# Health endpoint will be available at /api/health
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]

# FROM node:16-alpine
FROM node:18-alpine

WORKDIR /app

# Install dependencies for Express server
COPY package.json package-lock.json ./
RUN npm install

# Copy Express source code
COPY . .

# Importance: Set NODE_ENV to production
ENV NODE_ENV=production

# Expose backend port
EXPOSE 5001

# Start server (which also serves React build from ./public)
CMD ["node", "index.js"]
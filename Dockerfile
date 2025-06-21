FROM node:16-alpine

WORKDIR /app

# Install dependencies for Express server
COPY package.json package-lock.json ./
RUN npm install

# Copy Express source code
COPY . .

# Expose backend port
EXPOSE 5001

# Start server (which also serves React build from ./public)
CMD ["node", "index.js"]
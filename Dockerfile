# Use Ubuntu as base
FROM ubuntu:22.04

# Install FFmpeg + Node.js 18
RUN apt-get update && \
    apt-get install -y ffmpeg curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# App directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]

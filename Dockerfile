# ---- Base image with FFmpeg installed ----
FROM jrottenberg/ffmpeg:4.4-ubuntu

# ---- Install Node.js 18 ----
RUN apt-get update &&     apt-get install -y curl gnupg &&     curl -fsSL https://deb.nodesource.com/setup_18.x | bash - &&     apt-get install -y nodejs &&     apt-get clean && rm -rf /var/lib/apt/lists/*

# ---- App directory ----
WORKDIR /app

# ---- Install app dependencies ----
COPY package*.json ./
RUN npm install --production

# ---- Copy app source code ----
COPY . .

# ---- Expose API port ----
EXPOSE 3000

# ---- Start the API server ----
CMD ["node", "server.js"]

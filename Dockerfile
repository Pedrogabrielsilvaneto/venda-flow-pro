# Dockerfile para Pereira AI SDR Bot
FROM node:20-slim

# Instala Chromium e dependências para o Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Variáveis de ambiente para o Puppeteer usar o Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PORT=3000

WORKDIR /usr/src/app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o código
COPY . .

# Expõe a porta do dashboard
EXPOSE 3000

# Inicia o bot
CMD ["node", "index.js"]

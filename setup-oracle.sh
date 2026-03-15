#!/bin/bash

# ==========================================================================
# Script de Configuração para Oracle Cloud (Ubuntu)
# Alvo: Rodar Bot WhatsApp com Puppeteer (Chromium)
# ==========================================================================

echo "🚀 Iniciando configuração do sistema..."

# 1. Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências do Chrome/Puppeteer
echo "📦 Instalando dependências do Chromium..."
sudo apt install -y \
    chromium-browser \
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
    fonts-liberation \
    libasound2 \
    libnspr4 \
    libu2f-udev \
    xvfb

# 3. Instalar Node.js 20 (LTS)
echo "🟢 Instalando Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Instalar PM2 globalmente
echo "🌕 Instalando PM2..."
sudo npm install -g pm2

# 5. Configurar Firewall
echo "🛡️ Abrindo portas no firewall..."
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp

echo "✅ Configuração concluída!"
echo "📍 O caminho do Chromium para o .env ou index.js é: $(which chromium-browser)"
echo "--------------------------------------------------------------------------"
echo "Próximos passos:"
echo "1. Transfira o código do bot"
echo "2. Execute: npm install"
echo "3. Inicialize com: pm2 start index.js --name 'pereira-bot'"

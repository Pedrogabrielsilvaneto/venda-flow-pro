# Escolhe a imagem oficial do Node.js super leve
FROM node:20-slim

# Instala o Chromium e todas as dependências gráficas que o Puppeteer exige no Linux
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Informa ao Puppeteer para NÃO baixar sua própria cópia e sim usar a do sistema (instalada acima)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Configura o diretório de trabalho do projeto dentro do computador virtual
WORKDIR /usr/src/app

# Copia os arquivos de dependência e instala (o chrome não será baixado graças à ENV acima)
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do robô
COPY . .

# Expõe a porta que o motor precisa pra responder a API
EXPOSE 3001

# O comando mestre que rodará o robô assim que a máquina ligar
CMD ["npm", "run", "bot"]

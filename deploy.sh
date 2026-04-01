set -e

# Criar diretório se necessário
mkdir -p /home/ubuntu/vendaflow
cd /home/ubuntu/vendaflow

# Descompactar
if [ -f /home/ubuntu/project.zip ]; then
    unzip -o /home/ubuntu/project.zip -d /home/ubuntu/vendaflow
fi

# Configurar Variáveis de Ambiente
cat << 'EOF' > .env
AUTH_SECRET="vendaflow-super-secret-key-2026-mudar-em-producao"
MONGODB_URI="mongodb+srv://pedrogabrielsilvaneto_db_user:Vendaflow%402026@vendaflow.qlllyzt.mongodb.net/vendaflowdb?retryWrites=true&w=majority&appName=vendaflow"
GEMINI_API_KEY="AIzaSyCaFKO9mbtva8bDd_Cn6M-c_oKEsktIYK0"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="https://crm.pereiraacabamentos.com.br"
# Porta onde o Next.js vai rodar
PORT=3000
# URL do Bot (agora na mesma máquina)
BOT_URL="http://localhost:3001"
EOF

# Copia para .env.local para o Next.js
cp .env .env.local

# Limpeza e instalação
# node scripts/cleanup.js  # Só rodar se necessário limpar sessões antigas
npm install
npm run build

# Reiniciar processos com PM2 Ecosystem
pm2 delete all || true
pm2 start ecosystem.config.js --env production
pm2 save

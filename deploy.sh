set -e
mkdir -p /home/ubuntu/vendaflow
unzip -o /home/ubuntu/project.zip -d /home/ubuntu/vendaflow
cd /home/ubuntu/vendaflow

cat << 'EOF' > .env
AUTH_SECRET="vendaflow-super-secret-key-2026-mudar-em-producao"
MONGODB_URI="mongodb+srv://pedrogabrielsilvaneto_db_user:Vendaflow%402026@vendaflow.qlllyzt.mongodb.net/vendaflowdb?retryWrites=true&w=majority&appName=vendaflow"
GEMINI_API_KEY="AIzaSyCaFKO9mbtva8bDd_Cn6M-c_oKEsktIYK0"
AUTH_TRUST_HOST=true
PORT=3000
CHROME_PATH=/usr/bin/google-chrome-stable
EOF

# Clean up database - run the cleanup utility script
node scripts/cleanup.js

npm install
npm run build
pm2 delete all || true
pm2 start npm --name "dashboard" -- run start
pm2 start node --name "bot" -- local-bot.js
pm2 save

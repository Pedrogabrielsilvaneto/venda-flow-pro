/**
 * 🚀 Auto-Deploy Webhook para Pereira Acabamentos Bot
 * 
 * Este script roda junto com o servidor principal e expõe um endpoint
 * POST /deploy que, quando chamado, faz automaticamente:
 *   1. git pull origin main
 *   2. npm install (se package.json mudou)
 *   3. pm2 restart pereira-bot (ou reinicia o processo)
 * 
 * Para usar: adicione no servidor e chame POST /deploy para atualizar
 */

const { exec } = require('child_process');
const crypto = require('crypto');

const DEPLOY_SECRET = process.env.DEPLOY_SECRET || 'pereira_deploy_2024';
const PROJECT_DIR = __dirname;

function runDeploy(callback) {
    const commands = [
        `cd "${PROJECT_DIR}"`,
        'git pull origin main',
        'npm install --production',
        'pm2 restart pereira-bot || pm2 start index.js --name pereira-bot',
    ].join(' && ');

    console.log('🚀 Iniciando deploy automático...');
    exec(commands, { cwd: PROJECT_DIR }, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Erro no deploy:', error.message);
            if (callback) callback(false, error.message);
            return;
        }
        console.log('✅ Deploy concluído!');
        console.log('📜 Output:', stdout);
        if (stderr) console.warn('⚠️  Stderr:', stderr);
        if (callback) callback(true, stdout);
    });
}

// Middleware de deploy para adicionar ao Express
function deployRouter(app) {
    // POST /deploy — Trigger manual/automático
    app.post('/deploy', (req, res) => {
        const secret = req.headers['x-deploy-secret'] || req.body?.secret;

        if (secret !== DEPLOY_SECRET) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        res.json({ status: 'Deploy iniciado, aguarde ~30 segundos...' });

        // Executa o deploy em background
        setTimeout(() => {
            runDeploy((success, output) => {
                console.log(success ? '✅ Deploy OK' : '❌ Deploy FALHOU');
            });
        }, 500);
    });

    // GET /deploy/status — Verificar última versão deployada
    app.get('/deploy/status', (req, res) => {
        exec('git log -1 --format="%H %s %ar"', { cwd: PROJECT_DIR }, (err, stdout) => {
            res.json({
                lastCommit: stdout.trim() || 'Desconhecido',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            });
        });
    });

    console.log('🔗 Webhook de deploy registrado em POST /deploy');
}

module.exports = { deployRouter, runDeploy };

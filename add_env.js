import { execSync } from 'child_process';

const url = 'https://vendaflow-bot-engine.onrender.com';

const envs = ['production', 'preview', 'development'];

for (const env of envs) {
    try {
        console.log(`Adding for ${env}...`);
        execSync(`npx vercel env add NEXT_PUBLIC_BOT_URL ${env}`, {
            input: url,
            stdio: ['pipe', 'inherit', 'inherit'],
            encoding: 'utf-8'
        });
    } catch (e) {
        console.error(`Error adding to ${env}:`, e.message);
    }
}

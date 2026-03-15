const puppeteer = require('puppeteer-core');
async function test() {
    try {
        console.log('--- TESTANDO PUPPETEER ---');
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome-stable',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
        console.log('SUCESSO: ', await page.title());
        await browser.close();
    } catch (e) {
        console.log('ERRO:', e.message);
    }
}
test();

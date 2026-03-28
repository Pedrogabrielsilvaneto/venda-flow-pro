const { fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
async function test() {
    try {
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log('Version:', version);
        console.log('Is latest:', isLatest);
    } catch (e) {
        console.error('Error fetching version:', e);
    }
}
test();

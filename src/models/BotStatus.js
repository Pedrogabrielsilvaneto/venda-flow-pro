const mongoose = require('mongoose');

const BotStatusSchema = new mongoose.Schema({
    identifier: { type: String, default: 'main_bot' },
    status: { type: String, default: 'disconnected' },
    qrCode: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.BotStatus || mongoose.model('BotStatus', BotStatusSchema);

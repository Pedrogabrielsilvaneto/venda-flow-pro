const mongoose = require('mongoose');

const AIConfigSchema = new mongoose.Schema({
    identifier: { type: String, default: 'main_config' },
    botName: { type: String, default: 'Beatriz' },
    systemPrompt: { type: String },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.AIConfig || mongoose.model('AIConfig', AIConfigSchema);

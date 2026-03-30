import mongoose from 'mongoose';

const BotStatusSchema = new mongoose.Schema({
    identifier: { type: String, default: 'main_bot' },
    status: { type: String, default: 'disconnected' },
    qrCode: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.BotStatus || mongoose.model('BotStatus', BotStatusSchema);

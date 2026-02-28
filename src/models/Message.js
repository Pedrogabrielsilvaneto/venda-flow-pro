import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    from: { type: String, required: true }, // 'customer', 'bot', 'agent'
    to: { type: String },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);

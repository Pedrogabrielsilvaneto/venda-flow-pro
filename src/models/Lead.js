import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    nomeCliente: { type: String }, // Nome coletado pela IA
    email: { type: String },
    lastInteraction: { type: Date, default: Date.now },
    etapaChat: { 
        type: String, 
        enum: ['WELCOME', 'COLLECTING_NAME', 'IDENTIFYING_NEED', 'SHOWING_PRODUCTS', 'WAITING_HUMAN'], 
        default: 'WELCOME' 
    },
    history: [{
        from: { type: String }, // 'customer', 'bot', 'agent'
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    botPaused: { type: Boolean, default: false },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    intervencaoGestor: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

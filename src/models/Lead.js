const mongoose = require('mongoose');

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
    assignedTo: { type: String }, // Pode ser o ID do User
    intervencaoGestor: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

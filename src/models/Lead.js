import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    lastInteraction: { type: Date, default: Date.now },
    status: { type: String, default: 'new' }, // new, prospect, converted, etc.
    stage: { type: String, default: 'START' }, // Process flow stage
    history: [{
        from: { type: String }, // 'customer' or 'bot' or 'agent'
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    botPaused: { type: Boolean, default: false }, // if true, bot-logic skips auto-replies
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Human agent ID
    metadata: { type: mongoose.Schema.Types.Mixed }, // to store interests, categories visited, etc.
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

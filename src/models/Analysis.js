import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    type: { type: String, enum: ['AI_CHAT', 'ADMIN_SUGGESTION'], required: true },
    input: { type: String, required: true },
    output: { type: String, required: true },
    converted: { type: Boolean, default: false },
    metadata: { type: Object }
}, { timestamps: true });

export default mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);

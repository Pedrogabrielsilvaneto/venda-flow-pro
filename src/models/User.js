import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'gestor', 'vendedor'],
        default: 'vendedor'
    },
    status: {
        type: String,
        enum: ['online', 'busy', 'offline'],
        default: 'offline'
    },
    conversasAtivas: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['ADMIN', 'VENDEDOR'],
        default: 'VENDEDOR'
    },
    active: { type: Boolean, default: true },
    signature: { type: String },
    conversasAtivas: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

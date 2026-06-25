import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    username: {
        type: String,
        required: [true, 'O nome de usuário (login) é obrigatório.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9_]+$/, 'O nome de usuário deve conter apenas letras minúsculas, números e underline (_)']
    },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    cargo: {
        type: String,
        enum: ['gerente', 'vendedor', 'estagiario', 'cliente'],
        required: true
    },
    ativo: { type: Boolean, default: true }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Usuario', usuarioSchema);
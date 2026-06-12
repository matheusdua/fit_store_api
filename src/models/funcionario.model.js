import mongoose from 'mongoose';

const funcionarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
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

export default mongoose.model('Funcionario', funcionarioSchema);
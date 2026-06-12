import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
    referencia: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    categoria: { type: String, required: true },
    tamanho: { type: String, required: true },
    preco: { type: Number, required: true, min: 0 },
    estoque: { type: Number, required: true, min: 0 },
    cadastradoPor: { type: String, required: true },
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

export default mongoose.model('Produto', produtoSchema);
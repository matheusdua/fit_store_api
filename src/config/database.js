import mongoose from 'mongoose';
import 'dotenv/config';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    throw new Error('ERRO FATAL: MONGO_URI não foi definida no .env');
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: 'fit_store'
        });
        console.log('✅ Conectado com sucesso ao MongoDB Atlas via Mongoose!');
    } catch (error) {
        console.error('❌ Erro crítico de conexão via Mongoose:', error);
        process.exit(1);
    }
};

export { connectDB };
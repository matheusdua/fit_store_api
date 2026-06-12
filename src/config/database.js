import 'dotenv/config';
import { MongoClient } from 'mongodb';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    throw new Error('ERRO FATAL: MONGO_URI não foi definida no .env');
}

class Database {
    constructor() {
        this.client = new MongoClient(MONGO_URI);
        this.db = null;
    }

    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db('fit_store');
            console.log('📦 Conectado ao MongoDB Atlas com sucesso!');
        } catch (error) {
            console.error('❌ Erro de conexão com o MongoDB Atlas:', error);
            process.exit(1);
        }
    }

    getDb() {
        if (!this.db) {
            throw new Error('Acesso negado: O banco de dados ainda não foi conectado.');
        }
        return this.db;
    }
}

export default new Database();
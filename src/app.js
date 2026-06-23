import 'dotenv/config'; 

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import produtoRoutes from './routes/produto.routes.js';
import usuarioRoutes from './routes/usuario.routes.js'
import webRoutes from './routes/web.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/', webRoutes);

app.use((req, res, next) => {
    res.status(404).json({ mensagem: "A rota solicitada não existe." });
});

app.use((error, req, res, next) => {
    console.error(error);
    const status = error.statusCode || 500;
    const mensagem = error.message || 'Erro interno do servidor';
    res.status(status).json({ erro: mensagem });
});

export default app;
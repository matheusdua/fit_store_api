import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import authRoutes from './routes/auth.routes.js';
import produtoRoutes from './routes/produto.routes.js';
import usuarioRoutes from './routes/usuario.routes.js'
import webRoutes from './routes/web.routes.js';
import { logger } from './middlewares/logger.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(logger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FitStore API - Documentacao de Governanca',
            version: '1.0.0',
            description: 'API corporativa para controle de estoque, auditoria de registro e e-commerce da FitStore. Desenvolvida para avaliacao academica.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento Local',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Insira o token JWT retornado no endpoint de login para liberar os recursos restritos.',
                },
            },
            schemas: {
                LoginInput: {
                    type: 'object',
                    required: ['loginInput', 'senha'],
                    properties: {
                        loginInput: { type: 'string', description: 'Username, email ou loginInput do usuario' },
                        senha: { type: 'string', description: 'Senha cadastrada' }
                    }
                },
                RegisterInput: {
                    type: 'object',
                    required: ['nome', 'username', 'email', 'senha'],
                    properties: {
                        nome: { type: 'string', example: 'Matheus Felipe' },
                        username: { type: 'string', example: 'matheus_dev' },
                        email: { type: 'string', example: 'matheus@fitstore.com' },
                        senha: { type: 'string', example: 'senha123' },
                        cargo: { type: 'string', enum: ['gerente', 'vendedor', 'estagiario', 'cliente'], description: 'Se enviado por nao-gerente, sera forcado para cliente.' }
                    }
                },
                ProdutoInput: {
                    type: 'object',
                    required: ['nome', 'referencia', 'categoria', 'tamanho', 'preco', 'estoque'],
                    properties: {
                        nome: { type: 'string', example: 'Regata Cavada Dry' },
                        referencia: { type: 'string', example: 'REG-CAV-01' },
                        categoria: { type: 'string', example: 'Roupas' },
                        tamanho: { type: 'string', example: 'G' },
                        preco: { type: 'number', example: 59.90 },
                        estoque: { type: 'integer', example: 15 }
                    }
                },
                QuantidadeInput: {
                    type: 'object',
                    required: ['quantidade'],
                    properties: {
                        quantidade: { type: 'integer', minimum: 1, example: 1 }
                    }
                },
                UsuarioResponse: {
                    type: 'object',
                    properties: {
                        nome: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        cargo: { type: 'string' }
                    }
                },
                ProdutoResponse: {
                    type: 'object',
                    properties: {
                        referencia: { type: 'string' },
                        nome: { type: 'string' },
                        categoria: { type: 'string' },
                        tamanho: { type: 'string' },
                        preco: { type: 'string' },
                        estoque: { type: 'integer' }
                    }
                },
                ErroFiltroGlobal: {
                    type: 'object',
                    properties: {
                        erro: { type: 'string', example: 'Mensagem explicativa da excecao disparada.' }
                    }
                },
                ErroExpressValidator: {
                    type: 'object',
                    properties: {
                        sucesso: { type: 'boolean', example: false },
                        erros: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    msg: { type: 'string', example: 'O nome e obrigatorio.' },
                                    path: { type: 'string', example: 'nome' },
                                    location: { type: 'string', example: 'body' }
                                }
                            }
                        }
                    }
                }
            },
        },
    },
    apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
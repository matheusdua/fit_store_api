import ProdutoService from '../services/produto.service.js';
import UsuarioService from '../services/usuario.service.js';
import AuthService from '../services/auth.service.js';
import ProdutoController from './produto.controller.js';

import ProdutoModel from '../models/produto.model.js';
import UsuarioModel from '../models/usuario.model.js';

class WebController {
    static async listarCatalogo(req, res) {
        try {
            const busca = req.query.busca || '';
            const produtosDTO = await ProdutoService.getAll(busca, req.cargoAutenticado);

            const produtos = await Promise.all(produtosDTO.map(async (p) => {
                const prodRaw = await ProdutoModel.findOne({ referencia: p.referencia }).lean();
                return {
                    ...p,
                    ativo: prodRaw ? prodRaw.ativo : true
                };
            }));

            res.render('produtos', {
                produtos,
                busca,
                mostrarBusca: true,
                usuarioLogado: req.usernameAutenticado,
                cargoUsuario: req.cargoAutenticado,
                error: req.query.error
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno ao carregar a vitrine.');
        }
    }

    static async listarProdutoUnico(req, res) {
        try {
            const { referencia } = req.params;
            const produtoDTO = await ProdutoService.getByReferencia(referencia);
            const prodRaw = await ProdutoModel.findOne({ referencia }).lean();

            const produto = {
                ...produtoDTO,
                ativo: prodRaw ? prodRaw.ativo : true
            };

            if (produto.cadastradoPor) {
                try {
                    const usuario = await UsuarioService.getByUsername(produto.cadastradoPor);
                    produto.nomeAutor = usuario.nome;
                } catch (err) {
                    produto.nomeAutor = 'Usuario Desconhecido';
                }
            }

            res.render('produto_detalhe', {
                produto,
                usuarioLogado: req.usernameAutenticado,
                cargoUsuario: req.cargoAutenticado,
                error: req.query.error
            });
        } catch (error) {
            res.status(404).send('Produto nao encontrado na vitrine.');
        }
    }

    static async listarEquipe(req, res) {
        try {
            const usuariosDTO = await UsuarioService.getAll();

            const usuarios = await Promise.all(usuariosDTO.map(async (u) => {
                const userRaw = await UsuarioModel.findOne({ username: u.username }).lean();
                return {
                    ...u,
                    ativo: userRaw ? userRaw.ativo : true
                };
            }));

            res.render('funcionarios', {
                usuarios,
                usuarioLogado: req.usernameAutenticado,
                cargoUsuario: req.cargoAutenticado
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno ao carregar a lista de funcionarios.');
        }
    }

    static exibirLogin(req, res) {
        res.render('login', { title: 'Login - FitStore', erro: req.query.erro });
    }

    static async processarLogin(req, res) {
        try {
            const { loginInput, senha } = req.body;
            const resultado = await AuthService.login(loginInput, senha);

            res.cookie('token', resultado.token, {
                httpOnly: true,
                secure: false,
                maxAge: 3600000,
                path: '/'
            });

            res.redirect('/vitrine');
        } catch (error) {
            console.error(error);
            res.redirect('/login?erro=' + encodeURIComponent(error.message || 'Erro nas credenciais'));
        }
    }

    static exibirRegister(req, res) {
        res.render('register', { title: 'Criar Conta - FitStore', erro: req.query.erro });
    }

    static async processarRegister(req, res) {
        try {
            // Executa o servico core de criacao de conta (Nasce como cliente por padrao)
            await AuthService.register(req.body, req.cargoAutenticado);

            // Redireciona para a tela de login apos o cadastro bem-sucedido
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.redirect('/register?erro=' + encodeURIComponent(error.message || 'Erro ao criar conta'));
        }
    }

    static exibirCadastroProduto(req, res) {
        res.render('produto_novo', {
            title: 'Novo Produto - FitStore',
            usuarioLogado: req.usernameAutenticado,
            cargoUsuario: req.cargoAutenticado,
            erro: req.query.erro
        });
    }

    static async processarCadastroProduto(req, res) {
        try {
            if (req.body.preco) req.body.preco = Number(req.body.preco);
            if (req.body.estoque) req.body.estoque = parseInt(req.body.estoque) || 0;

            let erroController = null;

            const fakeRes = {
                statusCode: 201,
                status: function (code) { this.statusCode = code; return this; },
                json: function (data) { if (this.statusCode >= 400 || data.erro) erroController = data.erro; return this; }
            };

            await ProdutoController.create(req, fakeRes, (err) => { if (err) erroController = err.message || err; });
            if (erroController) throw new Error(erroController);

            res.redirect('/vitrine');
        } catch (error) {
            console.error(error);
            res.redirect('/produtos/novo?erro=' + encodeURIComponent(error.message || 'Erro ao processar criacao'));
        }
    }

    static async processarCompraWeb(req, res) {
        const { referencia } = req.params;
        try {
            req.body.quantidade = parseInt(req.body.quantidade) || 1;
            let erroController = null;

            const fakeRes = {
                statusCode: 200,
                status: function (code) { this.statusCode = code; return this; },
                json: function (data) { if (this.statusCode >= 400 || data.erro) erroController = data.erro; return this; }
            };

            await ProdutoController.vender(req, fakeRes, (err) => { if (err) erroController = err.message || err; });
            if (erroController) throw new Error(erroController);

            res.redirect('/vitrine');
        } catch (error) {
            res.redirect(`/vitrine/${referencia}?error=` + encodeURIComponent(error.message));
        }
    }

    static async processarReporWeb(req, res) {
        const { referencia } = req.params;
        try {
            req.body.quantidade = parseInt(req.body.quantidade) || 1;
            let erroController = null;

            const fakeRes = {
                statusCode: 200,
                status: function (code) { this.statusCode = code; return this; },
                json: function (data) { if (this.statusCode >= 400 || data.erro) erroController = data.erro; return this; }
            };

            await ProdutoController.repor(req, fakeRes, (err) => { if (err) erroController = err.message || err; });
            if (erroController) throw new Error(erroController);

            const originHeader = req.headers.referer && req.headers.referer.includes('/vitrine/');
            if (originHeader) {
                return res.redirect(`/vitrine/${referencia}`);
            }
            res.redirect('/vitrine');
        } catch (error) {
            res.redirect(`/vitrine?error=` + encodeURIComponent(error.message));
        }
    }

    static async processarInativarWeb(req, res) {
        const { referencia } = req.params;
        try {
            const prodRaw = await ProdutoModel.findOne({ referencia: referencia.toUpperCase() });

            if (!prodRaw) {
                throw new Error('Produto nao encontrado na base para alteracao.');
            }

            if (prodRaw.ativo === false) {
                await ProdutoModel.updateOne({ _id: prodRaw._id }, { $set: { ativo: true } });

                const origemDetalhe = req.headers.referer && req.headers.referer.includes('/vitrine/');
                if (origemDetalhe) {
                    return res.redirect(`/vitrine/${referencia}`);
                }
                return res.redirect('/vitrine');
            }

            let erroController = null;

            const fakeRes = {
                statusCode: 200,
                status: function (code) { this.statusCode = code; return this; },
                json: function (data) { if (this.statusCode >= 400 || data.erro) erroController = data.erro; return this; }
            };

            await ProdutoController.inativar(req, fakeRes, (err) => { if (err) erroController = err.message || err; });
            if (erroController) throw new Error(erroController);

            const origemDetalhe = req.headers.referer && req.headers.referer.includes('/vitrine/');
            if (origemDetalhe) {
                return res.redirect(`/vitrine/${referencia}`);
            }
            res.redirect('/vitrine');
        } catch (error) {
            res.redirect(`/vitrine?error=` + encodeURIComponent(error.message));
        }
    }
}

export default WebController;
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('ERRO FATAL: JWT_SECRET não está definido nas variáveis de ambiente.');
}

const extrairTokenNativo = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
        if (tokenCookie) {
            const rawCookie = tokenCookie.trim();
            const eqIndex = rawCookie.indexOf('=');
            return rawCookie.substring(eqIndex + 1).trim();
        }
    }

    return null;
};

export const verificarToken = (req, res, next) => {
    const token = extrairTokenNativo(req);

    if (!token) {
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ erro: "Token de autenticação não fornecido." });
        }
        return res.redirect('/login');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (req.originalUrl.startsWith('/api/')) {
                return res.status(401).json({ erro: "Token inválido ou expirado." });
            }
            return res.redirect('/login');
        }

        req.usernameAutenticado = decoded.username || decoded.login || decoded.email;
        req.cargoAutenticado = decoded.cargo || decoded.role || decoded.tipo;
        next();
    });
};

export const apenasCargos = (cargosPermitidos) => {
    return (req, res, next) => {
        const cargoDoUsuario = req.cargoAutenticado;

        if (!cargoDoUsuario || !cargosPermitidos.includes(cargoDoUsuario)) {
            if (req.originalUrl.startsWith('/api/')) {
                return res.status(403).json({ erro: "Acesso negado. Permissao insuficiente." });
            }
            return res.status(403).send("Acesso negado. Seu cargo nao tem permissao para ver esta tela.");
        }
        next();
    };
};

export const coletarCargoOpcional = (req, res, next) => {
    const token = extrairTokenNativo(req);
    if (!token) return next();

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (!err) {
            req.usernameAutenticado = decoded.username || decoded.login || decoded.email;
            req.cargoAutenticado = decoded.cargo || decoded.role || decoded.tipo;
        }
        next();
    });
};
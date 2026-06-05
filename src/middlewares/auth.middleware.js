import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('ERRO FATAL: JWT_SECRET não está definido nas variáveis de ambiente.');
}

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token de autenticação não fornecido." });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ erro: "Erro no formato do token." });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ erro: "Token mal formatado." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: "Token inválido ou expirado." });
        }

        req.usuarioAutenticado = decoded.id;
        req.cargoAutenticado = decoded.cargo;

        next();
    });
};

export const apenasCargos = (cargosPermitidos) => {
    return (req, res, next) => {
        const cargoDoUsuario = req.cargoAutenticado;

        if (!cargoDoUsuario || !cargosPermitidos.includes(cargoDoUsuario)) {
            return res.status(403).json({
                erro: "Acesso negado. Seu cargo não tem permissão para realizar esta ação."
            });
        }
        next();
    };
};
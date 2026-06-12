import app from './app.js';
import db from './config/database.js'; 

const PORT = process.env.PORT || 3000;

db.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor FitStore rodando na porta ${PORT}`);
        console.log(`http://localhost:${PORT}/vitrine`);
        console.log(`\n*-------------------------------------*\n\n`);
    });
});
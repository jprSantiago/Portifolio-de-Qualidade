require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('Conectado ao banco de dados PostgreSQL');
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
}

async function startServer() {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Frontend acessível em: ${FRONTEND_URL}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();

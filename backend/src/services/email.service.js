const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT === '465', // true para 465, false para outras portas
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendWelcomeEmail(user) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"NaSalinha" <noreply@nasalinha.com>',
                to: user.email,
                subject: 'Bem-vindo ao NaSalinha! 🎯',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #6366f1;">Bem-vindo ao NaSalinha!</h1>
                        <p>Olá <strong>${user.name}</strong>,</p>
                        <p>Sua conta foi criada com sucesso! Agora você pode começar a fazer check-ins e acumular pontos.</p>
                        <p><strong>Suas informações:</strong></p>
                        <ul>
                            <li>Nome: ${user.name}</li>
                            <li>E-mail: ${user.email}</li>
                            <li>Nível: ${user.role}</li>
                        </ul>
                        <p>Acesse <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="color: #6366f1;">aqui</a> para fazer login.</p>
                        <p>Bons check-ins! 🎯</p>
                    </div>
                `,
            });
        } catch (error) {
            throw error;
        }
    }

    async sendPasswordResetEmail(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"NaSalinha" <noreply@nasalinha.com>',
                to: user.email,
                subject: 'Redefinição de Senha - NaSalinha',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #6366f1;">Redefinição de Senha</h1>
                        <p>Olá <strong>${user.name}</strong>,</p>
                        <p>Recebemos uma solicitação para redefinir sua senha.</p>
                        <p>Clique no botão abaixo para criar uma nova senha:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background-color: #6366f1; 
                                      color: white; 
                                      padding: 12px 30px; 
                                      text-decoration: none; 
                                      border-radius: 5px;
                                      display: inline-block;">
                                Redefinir Senha
                            </a>
                        </div>
                        <p>Ou copie e cole este link no seu navegador:</p>
                        <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
                        <p><strong>Este link expira em 1 hora.</strong></p>
                        <p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
                        <p>Atenciosamente,<br>Equipe NaSalinha</p>
                    </div>
                `,
            });
        } catch (error) {
            console.error('❌ Erro ao enviar e-mail de redefinição:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();

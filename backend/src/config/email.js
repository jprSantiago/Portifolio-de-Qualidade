const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Aceita certificados auto-assinados
  },
});

/**
 * Envia e-mail
 * @param {object} options - Opções do e-mail
 * @param {string} options.to - Destinatário
 * @param {string} options.subject - Assunto
 * @param {string} options.html - Conteúdo HTML
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'NaSalinha <noreply@nasalinha.com>',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Falha no envio do e-mail');
  }
};

/**
 * Template de boas-vindas
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1893A6;">Bem-vindo ao NaSalinha! 🎉</h1>
      <p>Olá, <strong>${user.name}</strong>!</p>
      <p>Sua conta foi criada com sucesso. Estamos felizes em ter você conosco!</p>
      <p>Comece fazendo seu primeiro check-in e acumule pontos para subir no ranking.</p>
      <p style="margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/login" 
           style="background-color: #1893A6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Fazer Login
        </a>
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        NaSalinha - Sistema de Check-in Gamificado<br>
        Comp Júnior
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Bem-vindo ao NaSalinha! 🎯',
    html,
  });
};

/**
 * Template de recuperação de senha
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1893A6;">Recuperação de Senha 🔐</h1>
      <p>Olá, <strong>${user.name}</strong>!</p>
      <p>Você solicitou a recuperação de senha da sua conta NaSalinha.</p>
      <p>Clique no botão abaixo para redefinir sua senha:</p>
      <p style="margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #1893A6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Redefinir Senha
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">
        Este link expira em 1 hora.<br>
        Se você não solicitou esta alteração, ignore este e-mail.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">
        NaSalinha - Sistema de Check-in Gamificado<br>
        Comp Júnior
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Recuperação de Senha - NaSalinha',
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};

const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../config/email');

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: role || 'MEMBER',
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });

            sendWelcomeEmail(user).catch(console.error);

            const accessToken = generateAccessToken({ userId: user.id });
            const refreshToken = generateRefreshToken({ userId: user.id });

            res.status(201).json({
                success: true,
                message: 'Usuário registrado com sucesso',
                data: { user, accessToken, refreshToken },
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });

            if (!user || !await bcrypt.compare(password, user.password)) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas',
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário inativo',
                });
            }

            const accessToken = generateAccessToken({ userId: user.id });
            const refreshToken = generateRefreshToken({ userId: user.id });

            res.json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    accessToken,
                    refreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: 'Refresh token não fornecido',
                });
            }

            const decoded = verifyRefreshToken(refreshToken);
            const accessToken = generateAccessToken({ userId: decoded.userId });

            res.json({
                success: true,
                data: { accessToken },
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });

            if (user) {
                const resetToken = generateAccessToken({ userId: user.id, purpose: 'reset' });
                sendPasswordResetEmail(user, resetToken).catch(console.error);
            }

            res.json({
                success: true,
                message: 'Se o e-mail existir, você receberá instruções para redefinir a senha',
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token, newPassword } = req.body;

            const jwt = require('jsonwebtoken');
            let decoded;

            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Token inválido ou expirado',
                });
            }

            if (decoded.purpose !== 'reset') {
                return res.status(400).json({
                    success: false,
                    message: 'Token inválido',
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: decoded.userId },
                data: { updatedAt: new Date() },
            });

            res.json({
                success: true,
                message: 'Senha redefinida com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();

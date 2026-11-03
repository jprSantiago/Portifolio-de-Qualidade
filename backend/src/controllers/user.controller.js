const prisma = require('../config/database');

class UserController {
    async getAll(req, res, next) {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            res.json({
                success: true,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado',
                });
            }

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res) {
        res.json({
            success: true,
            data: req.user,
        });
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updates = req.body;

            const user = await prisma.user.update({
                where: { id },
                data: updates,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                },
            });

            res.json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleStatus(req, res, next) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado',
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { isActive: !user.isActive },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                },
            });

            res.json({
                success: true,
                message: `Usuário ${updatedUser.isActive ? 'ativado' : 'desativado'} com sucesso`,
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado',
                });
            }

            if (id === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Você não pode excluir sua própria conta',
                });
            }

            await prisma.user.delete({ where: { id } });

            res.json({
                success: true,
                message: 'Usuário deletado com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();

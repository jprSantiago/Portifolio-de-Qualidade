const prisma = require('../config/database');

class SeasonController {
    async create(req, res, next) {
        try {
            const season = await prisma.season.create({
                data: req.body,
            });

            res.status(201).json({
                success: true,
                message: 'Temporada criada com sucesso',
                data: season,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const seasons = await prisma.season.findMany({
                orderBy: { startDate: 'desc' },
            });

            res.json({
                success: true,
                data: seasons,
            });
        } catch (error) {
            next(error);
        }
    }

    async getActive(req, res, next) {
        try {
            const season = await prisma.season.findFirst({
                where: { isActive: true },
            });

            if (!season) {
                return res.status(404).json({
                    success: false,
                    message: 'Nenhuma temporada ativa',
                });
            }

            res.json({
                success: true,
                data: season,
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const season = await prisma.season.findUnique({
                where: { id },
            });

            if (!season) {
                return res.status(404).json({
                    success: false,
                    message: 'Temporada não encontrada',
                });
            }

            res.json({
                success: true,
                data: season,
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const season = await prisma.season.update({
                where: { id },
                data: req.body,
            });

            res.json({
                success: true,
                message: 'Temporada atualizada com sucesso',
                data: season,
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleActive(req, res, next) {
        try {
            const { id } = req.params;

            const season = await prisma.season.findUnique({
                where: { id },
            });

            if (!season) {
                return res.status(404).json({
                    success: false,
                    message: 'Temporada não encontrada',
                });
            }

            if (!season.isActive) {
                await prisma.season.updateMany({
                    where: { isActive: true },
                    data: { isActive: false },
                });
            }

            const updatedSeason = await prisma.season.update({
                where: { id },
                data: { isActive: !season.isActive },
            });

            res.json({
                success: true,
                message: `Temporada ${updatedSeason.isActive ? 'ativada' : 'desativada'} com sucesso`,
                data: updatedSeason,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            await prisma.season.delete({ where: { id } });

            res.json({
                success: true,
                message: 'Temporada deletada com sucesso',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SeasonController();

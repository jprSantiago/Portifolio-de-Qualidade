const prisma = require('../config/database');

class RankingController {
    async getGeneral(req, res, next) {
        try {
            const activeSeason = await prisma.season.findFirst({
                where: { isActive: true },
            });

            if (!activeSeason) {
                return res.json({
                    success: true,
                    data: [],
                    message: 'Nenhuma temporada ativa',
                });
            }

            const rankings = await prisma.point.findMany({
                where: { seasonId: activeSeason.id },
                include: {
                    user: {
                        select: { id: true, name: true, email: true, role: true },
                    },
                    season: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { totalPoints: 'desc' },
            });

            res.json({
                success: true,
                data: rankings,
            });
        } catch (error) {
            next(error);
        }
    }

    async getBySeason(req, res, next) {
        try {
            const { seasonId } = req.params;

            const rankings = await prisma.point.findMany({
                where: { seasonId },
                include: {
                    user: {
                        select: { id: true, name: true, email: true, role: true },
                    },
                },
                orderBy: { totalPoints: 'desc' },
            });

            res.json({
                success: true,
                data: rankings,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RankingController();

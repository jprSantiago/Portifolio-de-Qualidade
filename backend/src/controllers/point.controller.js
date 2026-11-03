const prisma = require('../config/database');

class PointController {
  async create(req, res, next) {
    try {
      const { userId, seasonId, totalPoints, checkInsCount } = req.body;

      const existingPoint = await prisma.point.findUnique({
        where: {
          userId_seasonId: { userId, seasonId },
        },
      });

      if (existingPoint) {
        return res.status(400).json({
          success: false,
          message:
            'Já existe um registro de pontos para este usuário nesta temporada',
        });
      }

      const point = await prisma.point.create({
        data: {
          userId,
          seasonId,
          totalPoints: totalPoints || 0,
          checkInsCount: checkInsCount || 0,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          season: {
            select: { id: true, name: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Registro de pontos criado com sucesso',
        data: point,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const points = await prisma.point.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          season: {
            select: { id: true, name: true },
          },
        },
        orderBy: { totalPoints: 'desc' },
      });

      res.json({
        success: true,
        data: points,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const point = await prisma.point.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          season: {
            select: { id: true, name: true },
          },
        },
      });

      if (!point) {
        return res.status(404).json({
          success: false,
          message: 'Registro de pontos não encontrado',
        });
      }

      res.json({
        success: true,
        data: point,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByUserAndSeason(req, res, next) {
    try {
      const { userId, seasonId } = req.params;

      const point = await prisma.point.findUnique({
        where: {
          userId_seasonId: { userId, seasonId },
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          season: {
            select: { id: true, name: true },
          },
        },
      });

      if (!point) {
        return res.status(404).json({
          success: false,
          message: 'Registro de pontos não encontrado',
        });
      }

      res.json({
        success: true,
        data: point,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { totalPoints, checkInsCount } = req.body;

      const point = await prisma.point.findUnique({
        where: { id },
      });

      if (!point) {
        return res.status(404).json({
          success: false,
          message: 'Registro de pontos não encontrado',
        });
      }

      const updatedPoint = await prisma.point.update({
        where: { id },
        data: {
          totalPoints,
          checkInsCount,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          season: {
            select: { id: true, name: true },
          },
        },
      });

      res.json({
        success: true,
        message: 'Registro de pontos atualizado com sucesso',
        data: updatedPoint,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const point = await prisma.point.findUnique({
        where: { id },
      });

      if (!point) {
        return res.status(404).json({
          success: false,
          message: 'Registro de pontos não encontrado',
        });
      }

      await prisma.point.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Registro de pontos deletado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PointController();

const prisma = require('../config/database');
const { uploadImage } = require('../config/cloudinary');
const fs = require('fs').promises;

class CheckInController {
  async create(req, res, next) {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Foto é obrigatória',
        });
      }

      const { url } = await uploadImage(req.file.path, 'checkins');

      await fs.unlink(req.file.path).catch(console.error);

      const season = await prisma.season.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      if (!season) {
        return res.status(400).json({
          success: false,
          message: 'Nenhuma temporada ativa encontrada',
        });
      }

      const checkIn = await prisma.checkIn.create({
        data: {
          userId,
          seasonId: season.id,
          photoUrl: url,
          status: 'APPROVED', // Auto-aprovado
          points: season.pointsPerCheckIn,
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

      await prisma.point.upsert({
        where: {
          userId_seasonId: { userId, seasonId: season.id },
        },
        update: {
          totalPoints: { increment: season.pointsPerCheckIn },
          checkInsCount: { increment: 1 },
        },
        create: {
          userId,
          seasonId: season.id,
          totalPoints: season.pointsPerCheckIn,
          checkInsCount: 1,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Check-in realizado com sucesso',
        data: checkIn,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const checkIns = await prisma.checkIn.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          season: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: checkIns,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyCheckIns(req, res, next) {
    try {
      const checkIns = await prisma.checkIn.findMany({
        where: { userId: req.user.id },
        include: {
          season: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: checkIns,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const checkIn = await prisma.checkIn.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          season: { select: { id: true, name: true } },
        },
      });

      if (!checkIn) {
        return res.status(404).json({
          success: false,
          message: 'Check-in não encontrado',
        });
      }

      res.json({
        success: true,
        data: checkIn,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { status, notes, points } = req.body;

      const checkIn = await prisma.checkIn.findUnique({
        where: { id },
      });

      if (!checkIn) {
        return res.status(404).json({
          success: false,
          message: 'Check-in não encontrado',
        });
      }

      const updatedCheckIn = await prisma.checkIn.update({
        where: { id },
        data: {
          status,
          notes,
          points,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          season: { select: { id: true, name: true } },
        },
      });

      res.json({
        success: true,
        message: 'Check-in atualizado com sucesso',
        data: updatedCheckIn,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const checkIn = await prisma.checkIn.findUnique({
        where: { id },
      });

      if (!checkIn) {
        return res.status(404).json({
          success: false,
          message: 'Check-in não encontrado',
        });
      }

      await prisma.checkIn.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Check-in deletado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CheckInController();

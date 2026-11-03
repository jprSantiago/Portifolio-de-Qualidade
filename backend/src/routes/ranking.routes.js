const express = require('express');
const rankingController = require('../controllers/ranking.controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/rankings:
 *   get:
 *     summary: Obter ranking geral de todos os usuários
 *     tags: [Rankings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ranking geral retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       position:
 *                         type: integer
 *                         description: Posição no ranking
 *                         example: 1
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                             example: João Silva
 *                           email:
 *                             type: string
 *                             example: joao@example.com
 *                       totalPoints:
 *                         type: integer
 *                         description: Total de pontos acumulados
 *                         example: 150
 *                       checkInsCount:
 *                         type: integer
 *                         description: Quantidade de check-ins
 *                         example: 15
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', rankingController.getGeneral);

/**
 * @swagger
 * /api/rankings/season/{seasonId}:
 *   get:
 *     summary: Obter ranking de uma temporada específica
 *     tags: [Rankings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da temporada
 *     responses:
 *       200:
 *         description: Ranking da temporada retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     season:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         name:
 *                           type: string
 *                           example: Temporada Verão 2024
 *                     ranking:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           position:
 *                             type: integer
 *                             description: Posição no ranking
 *                             example: 1
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               name:
 *                                 type: string
 *                                 example: João Silva
 *                               email:
 *                                 type: string
 *                                 example: joao@example.com
 *                           totalPoints:
 *                             type: integer
 *                             description: Total de pontos na temporada
 *                             example: 80
 *                           checkInsCount:
 *                             type: integer
 *                             description: Quantidade de check-ins na temporada
 *                             example: 8
 *       404:
 *         description: Temporada não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/season/:seasonId', rankingController.getBySeason);

module.exports = router;

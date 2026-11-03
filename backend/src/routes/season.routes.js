const express = require('express');
const seasonController = require('../controllers/season.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createSeasonSchema,
  updateSeasonSchema,
} = require('../validators/season.validator');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/seasons:
 *   post:
 *     summary: Criar nova temporada (CREATE - Admin only)
 *     tags: [Temporadas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Temporada Verão 2024
 *               description:
 *                 type: string
 *                 example: Temporada de check-ins do verão
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-01T00:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-03-01T00:00:00Z
 *               pointsPerCheckIn:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Temporada criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Temporada criada com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Season'
 *       400:
 *         description: Dados inválidos
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
 *       403:
 *         description: Não autorizado (requer role ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authorize('ADMIN'),
  validate(createSeasonSchema),
  seasonController.create
);

/**
 * @swagger
 * /api/seasons:
 *   get:
 *     summary: Listar todas as temporadas (READ)
 *     tags: [Temporadas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de temporadas retornada com sucesso
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
 *                     $ref: '#/components/schemas/Season'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', seasonController.getAll);

/**
 * @swagger
 * /api/seasons/active:
 *   get:
 *     summary: Obter temporada ativa (READ)
 *     tags: [Temporadas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Temporada ativa retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Season'
 *       404:
 *         description: Nenhuma temporada ativa encontrada
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
router.get('/active', seasonController.getActive);

/**
 * @swagger
 * /api/seasons/{id}:
 *   get:
 *     summary: Obter temporada por ID (READ)
 *     tags: [Temporadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da temporada
 *     responses:
 *       200:
 *         description: Temporada encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Season'
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
router.get('/:id', seasonController.getById);

/**
 * @swagger
 * /api/seasons/{id}:
 *   put:
 *     summary: Atualizar temporada (UPDATE - Admin only)
 *     tags: [Temporadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da temporada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Temporada Verão 2024 Atualizada
 *               description:
 *                 type: string
 *                 example: Descrição atualizada
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-01T00:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-03-01T00:00:00Z
 *               pointsPerCheckIn:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Temporada atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Temporada atualizada com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Season'
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
 *       403:
 *         description: Não autorizado (requer role ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  authorize('ADMIN'),
  validate(updateSeasonSchema),
  seasonController.update
);

/**
 * @swagger
 * /api/seasons/{id}/toggle-active:
 *   patch:
 *     summary: Ativar/Desativar temporada (Admin only)
 *     tags: [Temporadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da temporada
 *     responses:
 *       200:
 *         description: Status da temporada alterado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Temporada ativada com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Season'
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
 *       403:
 *         description: Não autorizado (requer role ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  '/:id/toggle-active',
  authorize('ADMIN'),
  seasonController.toggleActive
);

/**
 * @swagger
 * /api/seasons/{id}:
 *   delete:
 *     summary: Deletar temporada (DELETE - Admin only)
 *     tags: [Temporadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da temporada
 *     responses:
 *       200:
 *         description: Temporada deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Temporada deletada com sucesso
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
 *       403:
 *         description: Não autorizado (requer role ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authorize('ADMIN'), seasonController.delete);

module.exports = router;

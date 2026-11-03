const express = require('express');
const pointController = require('../controllers/point.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/points:
 *   post:
 *     summary: Criar novo registro de pontos (CREATE - Admin only)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - seasonId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               seasonId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174001
 *               totalPoints:
 *                 type: integer
 *                 example: 50
 *               checkInsCount:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Registro de pontos criado com sucesso
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
 *                   example: Registro de pontos criado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Point'
 *       400:
 *         description: Registro já existe
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
router.post('/', authorize('ADMIN'), pointController.create);

/**
 * @swagger
 * /api/points:
 *   get:
 *     summary: Listar todos os registros de pontos (READ)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros de pontos retornada com sucesso
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
 *                     $ref: '#/components/schemas/Point'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', pointController.getAll);

/**
 * @swagger
 * /api/points/{id}:
 *   get:
 *     summary: Obter registro de pontos por ID (READ)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro de pontos
 *     responses:
 *       200:
 *         description: Registro de pontos encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Point'
 *       404:
 *         description: Registro de pontos não encontrado
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
router.get('/:id', pointController.getById);

/**
 * @swagger
 * /api/points/user/{userId}/season/{seasonId}:
 *   get:
 *     summary: Obter registro de pontos por usuário e temporada (READ)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *       - in: path
 *         name: seasonId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da temporada
 *     responses:
 *       200:
 *         description: Registro de pontos encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Point'
 *       404:
 *         description: Registro de pontos não encontrado
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
router.get(
  '/user/:userId/season/:seasonId',
  pointController.getByUserAndSeason
);

/**
 * @swagger
 * /api/points/{id}:
 *   put:
 *     summary: Atualizar registro de pontos (UPDATE - Admin only)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro de pontos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalPoints:
 *                 type: integer
 *                 example: 100
 *               checkInsCount:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Registro de pontos atualizado com sucesso
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
 *                   example: Registro de pontos atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Point'
 *       404:
 *         description: Registro de pontos não encontrado
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
router.put('/:id', authorize('ADMIN'), pointController.update);

/**
 * @swagger
 * /api/points/{id}:
 *   delete:
 *     summary: Deletar registro de pontos (DELETE - Admin only)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do registro de pontos
 *     responses:
 *       200:
 *         description: Registro de pontos deletado com sucesso
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
 *                   example: Registro de pontos deletado com sucesso
 *       404:
 *         description: Registro de pontos não encontrado
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
router.delete('/:id', authorize('ADMIN'), pointController.delete);

module.exports = router;

const express = require('express');
const checkinController = require('../controllers/checkin.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/checkins:
 *   post:
 *     summary: Criar novo check-in (CREATE)
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photo
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Foto do check-in
 *     responses:
 *       201:
 *         description: Check-in criado com sucesso
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
 *                   example: Check-in realizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/CheckIn'
 *       400:
 *         description: Foto é obrigatória ou nenhuma temporada ativa
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
router.post('/', upload.single('photo'), checkinController.create);

/**
 * @swagger
 * /api/checkins:
 *   get:
 *     summary: Listar todos os check-ins (READ)
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de check-ins retornada com sucesso
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
 *                     $ref: '#/components/schemas/CheckIn'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', checkinController.getAll);

/**
 * @swagger
 * /api/checkins/my-checkins:
 *   get:
 *     summary: Listar meus check-ins (READ)
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de check-ins do usuário logado
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
 *                     $ref: '#/components/schemas/CheckIn'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my-checkins', checkinController.getMyCheckIns);

/**
 * @swagger
 * /api/checkins/{id}:
 *   get:
 *     summary: Obter check-in por ID (READ)
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do check-in
 *     responses:
 *       200:
 *         description: Check-in encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CheckIn'
 *       404:
 *         description: Check-in não encontrado
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
router.get('/:id', checkinController.getById);

/**
 * @swagger
 * /api/checkins/{id}:
 *   put:
 *     summary: Atualizar check-in (UPDATE - Admin only)
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do check-in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *                 example: APPROVED
 *               notes:
 *                 type: string
 *                 example: Check-in aprovado com sucesso
 *               points:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Check-in atualizado com sucesso
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
 *                   example: Check-in atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/CheckIn'
 *       404:
 *         description: Check-in não encontrado
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
router.put('/:id', authorize('ADMIN'), checkinController.update);

/**
 * @swagger
 * /api/checkins/{id}:
 *   delete:
 *     summary: Deletar check-in (DELETE - Admin only)
 *     tags: [Check-ins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do check-in
 *     responses:
 *       200:
 *         description: Check-in deletado com sucesso
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
 *                   example: Check-in deletado com sucesso
 *       404:
 *         description: Check-in não encontrado
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
router.delete('/:id', authorize('ADMIN'), checkinController.delete);

module.exports = router;

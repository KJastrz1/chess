const express = require('express');
const router = express.Router();
const gameController = require('../controllers/GameController');
const { protect } = require('../middleware/authMiddleware');

router.post('/games', protect, gameController.createGame);

router.get('/games', protect, gameController.getAllGames);

router.get('/games/:id', protect, gameController.getGameById);

router.put('/games/:id', protect, gameController.updateGame);

router.delete('/games/:id', protect, gameController.deleteGame);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management
 */

/**
 * @swagger
 * /api/v1/games:
 *   post:
 *     summary: Create a new game
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - player1
 *               - player2             
 *     responses:
 *       201:
 *         description: The game was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Retrieve a list of games
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */

/**
 * @swagger
 * /api/v1/games/{id}:
 *   get:
 *     summary: Get a game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game id
 *     responses:
 *       200:
 *         description: Game data for the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 */

/**
 * @swagger
 * /api/v1/games/{id}:
 *   put:
 *     summary: Update a game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The game id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: The game was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 */

/**
 * @swagger
 * /api/v1/games/{id}:
 *   delete:
 *     summary: Delete a game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The game id
 *     responses:
 *       204:
 *         description: The game was deleted
 *       404:
 *         description: Game not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - player1
 *         - player2
 *       properties:
 *         player1:
 *           type: string
 *         player2:
 *           type: string
 *         status:
 *           type: string
 *           enum: [waiting, in_progress, finished]
 *         winner:
 *           type: string
 *         board:
 *           type: array
 *           items:
 *             type: string
 *         moves:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *       example:
 *         player1: Alice
 *         player2: Bob
 *         status: in_progress
 *         winner: null
 *         board: ['E2', 'E4', '...']
 *         moves: [{ from: 'E2', to: 'E4' }]
 */

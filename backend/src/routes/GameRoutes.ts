import express from 'express';

import { handleAuthenticatedRequest, protect } from '../middleware/authMiddleware';
import { DeleteGameRequest, GetAllGamesRequest, GetGameByIdRequest, UpdateGameRequest, createGame, deleteGame, getAllGames, getGameById, updateGame } from '@src/controllers/GameController';

const router = express.Router();

router.post('/games', protect, handleAuthenticatedRequest(createGame));
router.get('/games', protect, handleAuthenticatedRequest<GetAllGamesRequest>(getAllGames));
router.get('/games/:id', protect, handleAuthenticatedRequest<GetGameByIdRequest>(getGameById));
router.put('/games/:id', protect, handleAuthenticatedRequest<UpdateGameRequest>(updateGame));
router.delete('/games/:id', protect, handleAuthenticatedRequest<DeleteGameRequest>(deleteGame));


export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - player1
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the game
 *         player1:
 *           type: string
 *           description: Reference to the first player's user ID
 *         player2:
 *           type: string
 *           description: Reference to the second player's user ID
 *         board:
 *           type: array
 *           items:
 *             type: array
 *             items:
 *               type: string
 *           description: The board state
 *         whitePlayer:
 *           type: string
 *           description: The ID of the player playing white
 *         whosMove:
 *           type: string
 *           description: The ID of the player whose turn it is
 *         moveTime:
 *           type: number
 *           description: The time per move in seconds
 *         moves:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Move'
 *         status:
 *           type: string
 *           description: The current status of the game
 *         winner:
 *           type: string
 *           nullable: true
 *           description: The ID of the winner, or null if the game is ongoing
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the game was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the game was last updated
 *     Move:
 *       type: object
 *       properties:
 *         srcRow:
 *           type: number
 *           description: Source row for the move
 *         srcCol:
 *           type: number
 *           description: Source column for the move
 *         destRow:
 *           type: number
 *           description: Destination row for the move
 *         destCol:
 *           type: number
 *           description: Destination column for the move
 *         figure:
 *           type: string
 *           description: The chess piece moved
 * tags:
 *   - name: Games
 *     description: The games managing API
 */

/**
 * @swagger
 * /games:
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
 *             properties:
 *               player1:
 *                 type: string
 *                 description: The ID of the user creating the game
 *     responses:
 *       201:
 *         description: The game was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get all games
 *     tags: [Games]
 *     parameters:
 *       - in: query
 *         name: player1
 *         schema:
 *           type: string
 *         description: Player 1 ID to filter by
 *       - in: query
 *         name: player2
 *         schema:
 *           type: string
 *         description: Player 2 ID to filter by
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Game status to filter by
 *       - in: query
 *         name: moveTime
 *         schema:
 *           type: number
 *         description: Move time to filter by
 *       - in: query
 *         name: winner
 *         schema:
 *           type: string
 *         description: Winner ID to filter by
 *     responses:
 *       200:
 *         description: A list of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get a game by ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The game ID
 *     responses:
 *       200:
 *         description: The found game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 *       400:
 *         description: Invalid ID supplied
 */

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Update a game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: The updated game
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Delete a game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The game ID
 *     responses:
 *       204:
 *         description: The game was deleted
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */

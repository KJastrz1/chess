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

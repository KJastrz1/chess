import express from 'express';

import { handleAuthenticatedRequest, protect } from '../middleware/authMiddleware';
import { DeleteGameRequest, GetGamesHistoryRequest, GetGameByIdRequest, UpdateGameRequest, createGame, deleteGame, getGames, getGameById, getGamesHistory, updateGame, GetGamesRequest } from '../controllers/GameController';

const router = express.Router();

router.get('/games/history', protect, handleAuthenticatedRequest<GetGamesHistoryRequest>(getGamesHistory));

router.post('/games', protect, handleAuthenticatedRequest(createGame));

router.get('/games', protect, handleAuthenticatedRequest<GetGamesRequest>(getGames));

router.get('/games/:id', protect, handleAuthenticatedRequest<GetGameByIdRequest>(getGameById));

router.put('/games/:id', protect, handleAuthenticatedRequest<UpdateGameRequest>(updateGame));

router.delete('/games/:id', protect, handleAuthenticatedRequest<DeleteGameRequest>(deleteGame));


export default router;

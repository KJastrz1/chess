import express from 'express';
import { register, login, getProfile, getCurrentUser, logout, getWebSocketToken, GetProfileRequest, GetRankingRequest, getRanking } from '../controllers/UserController';
import { handleAuthenticatedRequest, protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/users/register', register);

router.post('/users/login', login);

router.get('/users/profile/:id', protect, handleAuthenticatedRequest<GetProfileRequest>(getProfile));

router.get('/users/get-current-user', protect, handleAuthenticatedRequest(getCurrentUser));

router.get('/users/logout', handleAuthenticatedRequest(logout));

router.get('/users/get-websocket-token', protect, handleAuthenticatedRequest(getWebSocketToken));

router.get('/users/ranking', protect, handleAuthenticatedRequest<GetRankingRequest>(getRanking));

export default router;


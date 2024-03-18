import express from 'express';
import { register, login, getProfile, getCurrentUser, logout } from '../controllers/UserController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile', protect, getProfile);

router.get('/get-current-user', protect, getCurrentUser);

router.get('/logout', logout);

export default router;

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               email:
 *                 type: string
 *                 example: user1@email.com
 *                 format: email
 *               password:
 *                 type: string
 *                 example: password
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Invalid data
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@email.com
 *                 format: email
 *               password:
 *                 type: string
 *                 example: password
 *                 format: password
 *     responses:
 *       200:
 *         description: Logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Returns user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */


import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IUserModel, User } from '../models/User';
import { ILoginUser, INewUser } from '@src/types';
import { AuthenticatedRequest } from '@src/types/express';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



interface RegisterUserRequest extends Request {
    body: INewUser;
}
export const register = async (req: RegisterUserRequest, res: Response): Promise<void> => {
    console.log('register');
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }
        user = await User.findOne({ username });
        if (user) {
            res.status(400).json({ message: 'Username already in use' });
            return;
        }
        user = new User({
            username,
            email,
            password
        });
        await user.save();
        const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwtToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 604800000
        });

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };
        res.status(201).json({ userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

interface LoginUserRequest extends Request {
    body: ILoginUser;
}
export const login = async (req: LoginUserRequest, res: Response) => {
    console.log('login body: ', req.body);
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ _id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwtToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 604800000
        });
        const userResponse = {

            _id: user._id,
            username: user.username,
            email: user.email,
        };
        res.status(201).json({ userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = req.user;
    res.status(200).json(user);
};


export const logout = async (req: AuthenticatedRequest, res: Response) => {
    console.log('logout');
    res.cookie('jwtToken', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: false,
        sameSite: 'lax'
    })
    res.status(200).send('Logged out');
};

export interface GetProfileRequest extends AuthenticatedRequest {
    params: {
        id: string;
    };
}
export const getProfile = async (req: GetProfileRequest, res: Response): Promise<void> => {
    console.log('getProfile');
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getWebSocketToken = async (req: AuthenticatedRequest, res: Response) => {
    console.log('getWebSocketToken');
    const user = req.user;
    const websocketToken = jwt.sign({ _id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token: websocketToken });
};

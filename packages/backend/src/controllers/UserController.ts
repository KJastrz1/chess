import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { INewUser, IUser } from "@chess/types";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface RegisterUserRequest extends Request {
    user: INewUser;
}
export const register = async (req: RegisterUserRequest, res: Response): Promise<void> => {
    console.log('register');
    const { username, email, password } = req.user;
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
            sameSite: 'Lax',
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
    user: {
        email: string;
        password: string;
    };
}
export const login = async (req:LoginUserRequest, res:Response) => {
    console.log('login');
    const { email, password } = req.user;
    try {
        const user = await User.findOne({ email });
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
            sameSite: 'Lax',
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

interface GetCurrentUserRequest extends Request {
    user: IUser;
}
export const getCurrentUser = async (req, res) => {
    const user = req.user;

    return res.status(200).json(user);
};

interface LogoutUserRequest extends Request {
    user: IUser;
}
export const logout = async (req: LogoutUserRequest, res: Response) => {
    console.log('logout');
    res.cookie('jwtToken', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: false,
        sameSite: 'Lax'
    })
    res.status(200).send('Logged out');
};

interface GetProfileRequest extends Request {
    id: string;
}
export const getProfile = async (req: GetProfileRequest, res: Response) => {
    console.log('getProfile');
    try {

        const user = await User.findById(req.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

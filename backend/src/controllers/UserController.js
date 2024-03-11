const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


exports.register = async (req, res) => {
    console.log('register');
    const { username, email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already in use' });
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


exports.login = async (req, res) => {
    console.log('login');
    const { email, password } = req.body;
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


exports.getCurrentUser = async (req, res) => {
    const user = req.user;

    return res.status(200).json(user);
};

exports.logout = async (req, res) => {
    console.log('logout');
    res.cookie('jwtToken', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: false,
        sameSite: 'Lax'
    })
    res.status(200).send('Logged out');
};

exports.getProfile = async (req, res) => {
    console.log('getProfile');
    try {

        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

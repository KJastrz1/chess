const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies['jwtToken']) {
        try {
            token = req.cookies['jwtToken'];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user= await User.findById(decoded._id).select('-password');
           
            if (!req.user) {              
                return res.status(404).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Unauthorized access, invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};

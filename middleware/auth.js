const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;
        } catch (error) {
            return res.status(401).json({ msg: 'Token no válido' });
        }
    }
    
    next();
} 
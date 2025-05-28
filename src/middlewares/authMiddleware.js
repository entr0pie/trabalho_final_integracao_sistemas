// src/middlewares/authMiddleware.js

const { isAuthenticated  } = require('../services/authService');

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const valid = await isAuthenticated(token);
    if (!valid) return res.status(401).json({ error: 'Unauthorized' });

    next();
}

module.exports = authMiddleware;
// src/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { postMessage, getMessages } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, postMessage);
router.get('/', authMiddleware, getMessages);

module.exports = router;
// src/controllers/messageController.js

const { sendToQueue } = require('../queue/producer');
const { PrismaClient } = require('../prisma/generated');
const prisma = new PrismaClient();

async function postMessage(req, res) {
    const { content, userId } = req.body;
    await sendToQueue({ content, userId });
    res.status(202).json({ message: 'Message queued' });
}

async function getMessages(req, res) {
    const messages = await prisma.message.findMany();
    res.json(messages);
}

module.exports = { postMessage, getMessages };
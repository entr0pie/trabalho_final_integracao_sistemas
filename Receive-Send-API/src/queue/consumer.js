// src/queueue/consumer.js

const amqp = require('amqplib');
const { PrismaClient } = require('../prisma/generated');

const prisma = new PrismaClient();

async function consumeQueue() {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    const q = 'messages';

    await ch.assertQueue(q, { durable: true});

    ch.consume(q, async (msg) => {
        if (msg !== null) {
            const message = JSON.parse(msg.content.toString());
            await prisma.message.create({ data: message});
            ch.ack(msg);
        }
    });
}

module.exports = { consumeQueue };
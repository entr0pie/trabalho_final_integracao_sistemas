// src/queue/producer.js

const amqp = require('amqplib');

async function sendToQueue(message) {
    const conn = await amqp.connect('amqp://localhost');
    const ch = await conn.createChannel();
    const q = 'messages';
    await ch.assertQueue(q, { durable: true});
    ch.sendToQueue(q, Buffer.from(JSON.stringify(message)), { persistent: true});
}

module.exports = { sendToQueue };
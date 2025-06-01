// src/queue/queue.service.ts
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService {
    private connection;
    private channel;

    async connect() {
        this.connection = await amqp.connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
    }

    async sendToQueue(queueName: string, message: string) {
        if(!this.channel) await this.connect();
        await this.channel.assertQueue(queueName, { durable: true});
        this.channel.sendToQueue(queueName, Buffer.from(message));
    }

    async consume(queueName: string, callback: (msg: string) => void) {
        if (!this.channel) await this.connect();
        await this.channel.assertQueue(queueName, { durable: true});
        this.channel.consume(queueName, (msg) => {
            if (msg !== null) {
                callback(msg.content.toString());
                this.channel.ack(msg);
            }
        });
    }
}


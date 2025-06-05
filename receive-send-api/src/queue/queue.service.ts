import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;
    private readonly rabbitmqUri: string;
    private readonly logger = new Logger(QueueService.name); // Optional: for better logging

    constructor(private configService: ConfigService) {
        // Get URI from .env, with a fallback (though fallback might not be ideal for production)
        this.rabbitmqUri = this.configService.get<string>('RABBITMQ_URI') ?? 'amqp://guest:guest@localhost:5672';
        if (!this.rabbitmqUri) {
            this.logger.warn('RABBITMQ_URI not found in environment variables. Using default amqp://guest:guest@localhost:5672');
            this.rabbitmqUri = 'amqp://guest:guest@localhost:5672'; // Default/fallback
        }
    }

    async onModuleInit() {
        await this.connect();
    }

    async connect(): Promise<void> {
        if (this.connection && this.channel) {
            this.logger.log('Already connected to RabbitMQ.');
            return;
        }

        try {
            this.logger.log(`Attempting to connect to RabbitMQ at ${this.rabbitmqUri}`);
            this.connection = await amqp.connect(this.rabbitmqUri);
            this.logger.log('Successfully connected to RabbitMQ!');

            this.connection.on('error', (err: Error) => {
                this.logger.error('RabbitMQ connection error:', err.message);
                this.connection = null; // Reset for potential reconnection attempts
                this.channel = null;
                // Consider implementing a retry mechanism here
            });

            this.connection.on('close', () => {
                this.logger.warn('RabbitMQ connection closed.');
                this.connection = null;
                this.channel = null;
                // Consider implementing a retry mechanism here
            });

            this.channel = await this.connection.createChannel();
            this.logger.log('RabbitMQ channel created.');

        } catch (err) {
            this.logger.error(`Failed to connect to RabbitMQ: ${err.message}`, err.stack);
            this.connection = null;
            this.channel = null;
            // Propagate the error or handle it (e.g., retry after a delay)
            // For now, if it fails on startup, requests using the queue will fail.
            throw err; // Or handle more gracefully
        }
    }

    private async ensureConnected(): Promise<void> {
        if (!this.channel || !this.connection) {
            this.logger.warn('Not connected to RabbitMQ. Attempting to reconnect...');
            await this.connect();
        }
        if (!this.channel) { // Check again after attempting to connect
             this.logger.error('Failed to establish RabbitMQ channel after reconnect attempt.');
             throw new Error('RabbitMQ channel is not available.');
        }
    }

    async sendToQueue(queueName: string, message: string): Promise<void> {
        await this.ensureConnected();
        try {
            await this.channel!.assertQueue(queueName, { durable: true });
            this.channel!.sendToQueue(queueName, Buffer.from(message));
            this.logger.log(`Message sent to queue "${queueName}"`);
        } catch (err) {
            this.logger.error(`Error sending message to queue "${queueName}": ${err.message}`, err.stack);
            throw err;
        }
    }

    async consume(queueName: string, callback: (msg: string) => void | Promise<void>): Promise<void> {
        await this.ensureConnected();
        try {
            await this.channel!.assertQueue(queueName, { durable: true });
            this.logger.log(`Consuming messages from queue "${queueName}"`);
            this.channel!.consume(queueName, async (msg) => {
                if (msg !== null) {
                    try {
                        this.logger.log(`Message received from queue "${queueName}"`);
                        await callback(msg.content.toString());
                        this.channel!.ack(msg);
                    } catch (processingError) {
                        this.logger.error(`Error processing message from queue "${queueName}": ${processingError.message}`, processingError.stack);
                        // Decide whether to nack and requeue, or nack and discard
                        this.channel!.nack(msg, false, false); // false: don't requeue
                    }
                }
            });
        } catch (err) {
             this.logger.error(`Error consuming from queue "${queueName}": ${err.message}`, err.stack);
             throw err;
        }
    }

    async onModuleDestroy() {
        this.logger.log('Closing RabbitMQ connection...');
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            this.logger.log('RabbitMQ connection closed.');
        } catch (err) {
            this.logger.error('Error closing RabbitMQ connection:', err.message);
        }
    }
}
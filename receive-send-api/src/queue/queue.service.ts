import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;
    private readonly rabbitmqUri: string;
    private readonly logger = new Logger(QueueService.name);

    constructor(private configService: ConfigService) {
        const uri = this.configService.get<string>('RABBITMQ_URI');

        if (!uri) {
            throw new Error('Erro: variável RABBITMQ_URI não definida');
        }

        this.rabbitmqUri = uri;
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
                this.connection = null;
                this.channel = null;
            });

            this.connection.on('close', () => {
                this.logger.warn('RabbitMQ connection closed.');
                this.connection = null;
                this.channel = null;
            });

            this.channel = await this.connection.createChannel();
            this.logger.log('RabbitMQ channel created.');

        } catch (err) {
            this.logger.error(`Failed to connect to RabbitMQ: ${err.message}`, err.stack);
            this.connection = null;
            this.channel = null;
            throw err;
        }
    }

    private async ensureConnected(): Promise<void> {
        if (!this.channel || !this.connection) {
            this.logger.warn('Not connected to RabbitMQ. Attempting to reconnect...');
            await this.connect();
        }
        if (!this.channel) {
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
                        this.channel!.nack(msg, false, false);
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
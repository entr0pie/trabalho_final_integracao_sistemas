// src/message/message.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { AuthService } from 'src/auth/auth.service';
import { QueueService } from 'src/queue/queue.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Message]),
    HttpModule],
  controllers: [MessageController],
  providers: [MessageService, AuthService, QueueService],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('messages');
  }
}

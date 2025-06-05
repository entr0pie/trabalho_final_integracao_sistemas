import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { AuthModule } from 'src/auth/auth.module';
import { QueueService } from 'src/queue/queue.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager'; // Importando o CacheModule
import * as redisStore from 'cache-manager-redis-store'; // Para o Redis Store

@Module({
  imports: [
    AuthModule,
    HttpModule,
    CacheModule.register({ // Registrando o CacheModule
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      ttl: 300, // Você pode configurar o TTL aqui
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService, QueueService],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('messages');
  }
}

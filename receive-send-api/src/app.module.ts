// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { HttpModule } from '@nestjs/axios';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // false em produção
    }),
    MessageModule,
    AuthModule,
    QueueModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 300, // 5 minutos de cache
      isGlobal: true, // Torna o cache global
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {
    console.log('--- Debugging DB Credentials ---');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USERNAME:', process.env.DB_USERNAME);
    console.log('DB_DATABASE:', process.env.DB_DATABASE);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('Typeof DB_PASSWORD:', typeof process.env.DB_PASSWORD);
    console.log('Is DB_PASSWORD falsy (null/undefined/empty)?', !process.env.DB_PASSWORD);
    console.log('--- End Debugging DB Credentials ---');
  }
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'message', method: RequestMethod.POST },
        { path: 'message/worker', method: RequestMethod.POST },
        { path: 'message', method: RequestMethod.GET },
      );
  }
}
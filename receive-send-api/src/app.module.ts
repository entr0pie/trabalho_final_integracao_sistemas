// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // Ensure this is from '@nestjs/config'
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <<<< MOVED TO THE VERY TOP
    HttpModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      // ttl: 300, // You can add TTL here if needed
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {
    console.log('--- Debugging Loaded Environment Variables (AppModule Constructor) ---');
    console.log('DB_HOST (expected by TypeORM):', process.env.DB_HOST);
    console.log('DB_PORT (expected by TypeORM):', process.env.DB_PORT);
    console.log('DB_USERNAME (expected by TypeORM):', process.env.DB_USERNAME);
    console.log('DB_DATABASE (expected by TypeORM):', process.env.DB_DATABASE);
    console.log('DB_PASSWORD (expected by TypeORM) is set:', !!process.env.DB_PASSWORD);
    console.log('Typeof DB_PASSWORD (expected by TypeORM):', typeof process.env.DB_PASSWORD);
    console.log('REDIS_HOST (expected by CacheModule):', process.env.REDIS_HOST);
    console.log('REDIS_PORT (expected by CacheModule):', process.env.REDIS_PORT);
    console.log('--- End Debugging ---');
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
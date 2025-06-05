import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';  // Módulo de saúde da aplicação
import { MessageModule } from './message/message.module'; // Módulo de mensagens
import { AuthModule } from './auth/auth.module';  // Módulo de autenticação
import { QueueModule } from './queue/queue.module';  // Módulo de fila
import { HttpModule } from '@nestjs/axios';
import { AuthMiddleware } from './auth/auth.middleware';  // Middleware de autenticação
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuração global do ConfigModule para carregar variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,  // Torna as variáveis de ambiente acessíveis globalmente
    }),

    // Configuração do TypeOrm para PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',  // Valor padrão 'localhost' se DB_HOST não estiver definido
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5433,  // Porta do banco, valor padrão 5433
      username: process.env.DB_USERNAME || 'user',  // Valor padrão 'user' se DB_USERNAME não estiver definido
      password: process.env.DB_PASSWORD || '',  // Senha vazia por padrão se DB_PASSWORD não estiver definido
      database: process.env.DB_DATABASE || 'test',  // Valor padrão 'test' se DB_DATABASE não estiver definido
      autoLoadEntities: true,  // Carrega entidades automaticamente
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,  // false em produção
    }),

    // Módulo de mensagens
    MessageModule,
    // Módulo de autenticação
    AuthModule,
    // Módulo de fila
    QueueModule,
    // Módulo de saúde da aplicação
    HealthModule,  // Adicionando o módulo de saúde
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

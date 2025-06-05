import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';  // Módulo de saúde da aplicação
import { MessageModule } from './message/message.module'; // Módulo de mensagens
import { AuthModule } from './auth/auth.module';  // Módulo de autenticação
import { QueueModule } from './queue/queue.module';  // Módulo de fila
import { AuthMiddleware } from './auth/auth.middleware';  // Middleware de autenticação
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuração global do ConfigModule para carregar variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,  // Torna as variáveis de ambiente acessíveis globalmente
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

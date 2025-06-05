import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';  // Importando o CacheModule

@Module({
  imports: [
    CacheModule.register(),  // Registra o CacheModule com configurações padrão (ou adicione configurações se necessário)
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

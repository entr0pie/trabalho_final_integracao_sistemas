import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    const bodyUserIdSend = req.body?.userIdSend;
    const bodyUserId = req.body?.userId;
    const queryUserId = req.query?.userId;

     const userId = bodyUserIdSend || queryUserId || bodyUserId;

     // Logs para depuração
    console.log('-----------------------------------------');
    console.log('[AuthMiddleware] Verificando token e userId...');
    console.log('[AuthMiddleware] Token recebido (req.headers["authorization"]):', token);
    console.log('[AuthMiddleware] req.body:', JSON.stringify(req.body, null, 2)); // Mostra o corpo da requisição
    console.log('[AuthMiddleware] userIdSend (do corpo):', bodyUserIdSend);
    console.log('[AuthMiddleware] userId (do corpo, fallback):', bodyUserId);
    console.log('[AuthMiddleware] userId (da query):', queryUserId);
    console.log('[AuthMiddleware] userId final determinado:', userId);
    console.log('-----------------------------------------');

    if (!token || !userId) {
      console.error('[AuthMiddleware] FALHA: Token ou userId não fornecido.');
      console.error(`[AuthMiddleware] Detalhes - Token existe: ${!!token}, UserId existe: ${!!userId} (valor: ${userId})`);
      throw new UnauthorizedException('Token ou userId não fornecido.');
    }

    const tokenString = String(token);
    console.log(`[AuthMiddleware] Autenticando token: ${tokenString.substring(0, 20)}...`); // Loga parte do token

    const isAuth = await this.authService.isAuthenticated(tokenString);

    if (!isAuth) {
      console.error('[AuthMiddleware] FALHA: Usuário não autenticado pelo AuthService.');
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    console.log('[AuthMiddleware] SUCESSO: Usuário autenticado. Prosseguindo...');
    next();
  }
}

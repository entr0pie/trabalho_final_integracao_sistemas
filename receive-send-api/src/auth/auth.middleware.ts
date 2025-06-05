import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    // Logs para depuração
    console.log('-----------------------------------------');
    console.log('[AuthMiddleware] Verificando token e userId...');
    console.log('[AuthMiddleware] Token recebido (req.headers["authorization"]):', token);
    console.log('[AuthMiddleware] req.body:', JSON.stringify(req.body, null, 2)); // Mostra o corpo da requisição
    console.log('-----------------------------------------');

    if (!token) {
      console.error('[AuthMiddleware] FALHA: Token não fornecido.');
      throw new UnauthorizedException('Token não fornecido.');
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

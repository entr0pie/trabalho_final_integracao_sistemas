import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    const userId = req.body?.userIdSend || req.query?.userId || req.body?.userId;

    if (!token || !userId) {
      throw new UnauthorizedException('Token ou userId não fornecido.');
    }

    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

    const isAuth = await this.authService.isAuthenticated(token.toString());

    if (!isAuth) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    next();
  }
}

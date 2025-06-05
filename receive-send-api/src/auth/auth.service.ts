// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly authBaseUrl: string;
  
  constructor(private readonly config: ConfigService) {
    const authBaseUrl = this.config.get<string>('AUTH_API_BASE_URL');
    
    if (!authBaseUrl) {
      throw new Error('Erro: variável AUTH_API_BASE_URL não definida')
    }

    this.authBaseUrl = authBaseUrl;
  }

  async isAuthenticated(token: string): Promise<boolean> {
    console.log(`[AuthService] Verificando autenticação para o token: ${token}`);

    if (!token || typeof token !== 'string') {
      console.error('[AuthService] Token inválido ou não fornecido para isAuthenticated.');
      throw new UnauthorizedException('Token não fornecido.');
    }

    let actualTokenValue = token.trim();
    const bearerPrefixLower = 'bearer ';
    const bearerPrefixProper = 'Bearer ';

    // Verifica se o token começa com "bearer " (qualquer case) e extrai o valor puro do token
    if (actualTokenValue.toLowerCase().startsWith(bearerPrefixLower)) {
      actualTokenValue = actualTokenValue.substring(bearerPrefixLower.length).trim();
      console.log(`[AuthService] Prefixo "bearer" (qualquer case) removido. Token puro: "${actualTokenValue}"`);
    }

    // Monta o cabeçalho final com "Bearer " (maiúsculo) + valor puro do token
    const authorizationHeaderFinal = `${bearerPrefixProper}${actualTokenValue}`;
    console.log(`[AuthService] Valor final do cabeçalho Authorization a ser usado para Auth-API: "${authorizationHeaderFinal}"`);

    try {
      console.log(`[AuthService] Tentando GET para ${this.authBaseUrl}/token`);
      const response = await axios.get(`${this.authBaseUrl}/token`,{
        headers: {
          Authorization: authorizationHeaderFinal,
        },
      });

      console.log('[AuthService] Resposta da Auth-API - Status:', response.status);
      console.log('[AuthService] Resposta da Auth-API - Data:', response.data);
      
      return response.data?.auth;
    } catch (err) {
      console.error('Erro ao autenticar:', err.message);
      throw new UnauthorizedException('Falha na autenticação com a Auth-API.');
    }
  }

  async getAllUsers(): Promise<{ user_id: number; email: string; name: string; lastName: string; password: string }[]> {
    try {
        const response = await axios.get(`${this.authBaseUrl}/users`);
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar todos os usuários:', err.message);
        return [];
    }
  }
}

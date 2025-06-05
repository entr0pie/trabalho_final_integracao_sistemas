// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

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

    /*const cacheKey = `auth:${token}`;
    const cachedResult = await this.cacheManager.get<boolean>(cacheKey);

    if (cachedResult !== undefined) {
      console.log(`Cache hit for auth: ${cacheKey}`);
      return cachedResult === true;
    }*/

    try {
      console.log(`[AuthService] Tentando GET para http://localhost:8000/validate-token`);
      const response = await axios.get('http://localhost:8000/validate-token',{
        headers: {
          Authorization: authorizationHeaderFinal,
        },
      });

      console.log('[AuthService] Resposta da Auth-API - Status:', response.status);
      console.log('[AuthService] Resposta da Auth-API - Data:', response.data);
      /*const isAuthenticated = response.data?.auth === true;
      await this.cacheManager.set(cacheKey, isAuthenticated, 3600); // Cache por 5 minutos
      console.log(`Cache set for all users: ${cacheKey}`);*/

      return response.data;
    } catch (err) {
      console.error('Erro ao autenticar:', err.message);
      throw new UnauthorizedException('Falha na autenticação com a Auth-API.');
    }
  }

  async getAllUsers(): Promise<{ user_id: number; email: string; name: string; lastName: string; password: string }[]> {
    try {
        const response = await axios.get('http://localhost:8000/users', {
        headers: {
            Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVzdWFyaW8xQGVtYWlsLmNvbSIsImV4cCI6MTc0OTAwMTI5M30.ROPnGd3E664jN8B69KeE5W1rs1D1uP1gfcCYfFvg0Og',
        },
        });
        return response.data;
    } catch (err) {
        console.error('Erro ao buscar todos os usuários:', err.message);
        return [];
    }
  }
}

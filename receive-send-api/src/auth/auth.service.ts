// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async isAuthenticated(token: string): Promise<boolean> {
    /*const cacheKey = `auth:${token}`;
    const cachedResult = await this.cacheManager.get<boolean>(cacheKey);

    if (cachedResult !== undefined) {
      console.log(`Cache hit for auth: ${cacheKey}`);
      return cachedResult === true;
    }*/
   console.log(`Validating token: ${token}`);

    try {
      const response = await axios.get('http://localhost:8000/validate-token',{
        headers: {
          Authorization: token,
        },
      });
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

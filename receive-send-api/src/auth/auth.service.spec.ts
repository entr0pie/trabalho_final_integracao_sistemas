import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  let service: AuthService;
  let cacheManager: any;

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve autenticar com token válido', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: true });

    const result = await service.isAuthenticated('Bearer tokenvalido');

    expect(result).toBe(true);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8000/validate-token',
      { headers: { Authorization: 'Bearer tokenvalido' } },
    );
  });

  it('deve lançar exceção se token for inválido', async () => {
    await expect(service.isAuthenticated('')).rejects.toThrow(UnauthorizedException);
  });

  it('deve retornar usuários mockados da API', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { user_id: 1, email: 'a@a.com', name: 'A', lastName: 'B', password: '123' },
      ],
    });

    const result = await service.getAllUsers();
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('a@a.com');
  });
});

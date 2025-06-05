import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { of } from 'rxjs';

describe('MessageService', () => {
  let service: MessageService;
  let httpService: any;
  let cacheManager: any;

  beforeEach(async () => {
    httpService = {
      post: jest.fn(),
      get: jest.fn(),
    };
    cacheManager = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: HttpService, useValue: httpService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('deve chamar API para salvar mensagem', async () => {
    httpService.post.mockReturnValue(of({ status: 201 }));

    await service.saveToDatabase(1, 2, 'Olá', 'meu-token');

    expect(httpService.post).toHaveBeenCalled();
  });

  it('deve buscar conversa e salvar no cache', async () => {
    httpService.get.mockReturnValue(of({ data: ['mensagem 1'] }));

    const result = await service.getConversation(1, 2, 'meu-token');

    expect(result).toEqual(['mensagem 1']);
    expect(cacheManager.set).toHaveBeenCalled();
  });
});

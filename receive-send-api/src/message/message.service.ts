// src/message/message.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {

    private readonly recordApiUrl: string;

    constructor(private readonly httpService: HttpService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
      private readonly config: ConfigService,
    ) {
      this.recordApiUrl = this.config.get<string>('RECORD_API_BASE_URL') ?? '';

      if (!this.recordApiUrl) {
        throw new Error('Erro: variável RECORD_API_BASE_URL não definida');
      }
    }

    async saveToDatabase(userIdSend: number, userIdReceive: number, message: string) {
        const response$ = this.httpService.post(
            this.recordApiUrl + '/messages',
            { userIdSend, userIdReceive, message },
        );

        await lastValueFrom(response$);
    }

    async getConversation(userId1: number, userId2: number) {
      const cacheKey = `conversation:${userId1}:${userId2}`;
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached;
      }

      const response$ = this.httpService.get(
        this.recordApiUrl + '/messages',
        {
          params: {
            userIdSend: userId1,
            userIdReceive: userId2,
            page: 1,
            size: 100,
          },
        },
    );

    const response = await lastValueFrom(response$);

    await this.cacheManager.set(cacheKey, response.data, 300); 

    return response.data; 
  }
}

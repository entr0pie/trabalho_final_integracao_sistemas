// src/message/message.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MessageService {
    constructor(private readonly httpService: HttpService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async saveToDatabase(userIdSend: number, userIdReceive: number, message: string, token: string) {
        const response$ = this.httpService.post(
            `${process.env.RECORD_API}`,
            { userIdSend, userIdReceive, message },
            { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        await lastValueFrom(response$);
    }

    async getConversation(userId1: number, userId2: number, token: string) {
      const cacheKey = `conversation:${userId1}:${userId2}`;
      const cached = await this.cacheManager.get(cacheKey);

      if (cached) {
        return cached;
      }
      const response$ = this.httpService.get(
        `${process.env.RECORD_API}`,
        {
          params: {
            user_id_receive: userId2,
            page: 1,
            size: 100,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
    );

    const response = await lastValueFrom(response$);

    await this.cacheManager.set(cacheKey, response.data, 300); 

    return response.data; 
  }
}

// src/message/message.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MessageService {
    constructor(private readonly httpService: HttpService) {}

    async saveToDatabase(userIdSend: number, userIdReceive: number, message: string, token: string) {
        const response$ = this.httpService.post(
            'http://localhost:8080/message',
            { userIdSend, userIdReceive, message },
            { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        await lastValueFrom(response$);
    }

    async getConversation(userId1: number, userId2: number) {
    const response$ = this.httpService.get(
      `http://localhost:8080/message`,
      {
        params: {
          user_id_receive: userId2,
          page: 1,
          size: 100,
        },
        headers: {
          Authorization: 'Bearer <TOKEN>',
        },
      },
    );

    const response = await lastValueFrom(response$);
    return response.data; 
  }
}

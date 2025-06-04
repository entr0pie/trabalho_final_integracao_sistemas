// src/message/message.controller.ts
import { 
    Body,
    Controller,
    Get,
    Headers,
    Post,
    Query } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { QueueService } from 'src/queue/queue.service';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(
        private readonly authService: AuthService,
        private readonly queueService: QueueService,
        private readonly messageService: MessageService,
    ) {}

    @Post()
    async sendMessage(@Body() body: { userIdSend: number; userIdReceive: number; message: string }, @Headers('authorization') token: string) {
        const { userIdSend, userIdReceive, message } = body;

        const isAuthenticated = await this.authService.isAuthenticated(token);
        if (!isAuthenticated) {
            return { msg: 'User not authenticated' };
        }

        const queue = `${userIdSend}${userIdReceive}`;
        await this.queueService.sendToQueue(queue, JSON.stringify({ userIdSend, userIdReceive, message }));
        await this.messageService.saveToDatabase(userIdSend, userIdReceive, message, token);
        
        return { msg: 'Message sent successfully' };
    }

  @Post('/worker')
  async processMessages(@Body() body: { userIdSend: number; userIdReceive: number },
    @Headers('authorization') token: string) {
    const { userIdSend, userIdReceive } = body;

    const isAuthenticated = await this.authService.isAuthenticated(token);
    if (!isAuthenticated) {
      return { msg: 'User not authenticated' };
    }

      const queue = `${userIdSend}-${userIdReceive}`;
      await this.queueService.consume(queue, async (msg: string) => {
      await this.messageService.saveToDatabase(userIdSend, userIdReceive, msg, token);
    });

    return { msg: 'Worker listening' };
  }

  @Get()
  async getMessages(@Query('userId') userId: number) {
  const allUsers = await this.authService.getAllUsers();

  const messages = await Promise.all(
    allUsers.map(async (u) => {
      const msgs = await this.messageService.getConversation(u.user_id, userId);
      return msgs.map((m) => ({
        userId: m.userIdSend,
        msg: m.message,
      }));
    }),
  );

  return messages.flat();
  }
}


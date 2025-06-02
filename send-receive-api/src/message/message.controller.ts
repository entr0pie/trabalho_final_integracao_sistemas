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
    async sendMessage(@Body() body, @Headers('authorization') token: string) {
        const {userIdSend, userIdReceive, message} = body;

        const queue = `${userIdSend}${userIdReceive}`;
        await this.queueService.sendToQueue(queue, message);
        await this.messageService.saveToDatabase(userIdSend, userIdReceive, message);
        
        return { msg: 'Message sent successfully' };
    }

  @Post('/worker')
  async processMessages(@Body() body) {
    const { userIdSend, userIdReceive } = body;

    const queue = `${userIdSend}${userIdReceive}`;
    await this.queueService.consume(queue, async (msg: string) => {
        await this.messageService.saveToDatabase(userIdSend, userIdReceive, msg);
    });

    return { msg: 'Worker listening' };
  }

  @Get()
  async getMessages(@Query('userId') userId: number) {
  const allUsers = await this.authService.getAllUsers();

  const messages = await Promise.all(
    allUsers.map(async (u) => {
      const msgs = await this.messageService.getConversation(u.id, userId);
      return msgs.map((m) => ({
        userId: m.userIdSend,
        msg: m.message,
      }));
    }),
  );

  return messages.flat();
  }
}


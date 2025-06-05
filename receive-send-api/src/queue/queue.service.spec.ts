import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { ConfigService } from '@nestjs/config';

jest.mock('amqplib', () => ({
  connect: jest.fn().mockResolvedValue({
    createChannel: jest.fn().mockResolvedValue({}),
    on: jest.fn(),
  }),
}));

describe('QueueService', () => {
  let service: QueueService;
  let configService: ConfigService;

  beforeEach(async () => {
    configService = {
      get: jest.fn().mockReturnValue('amqp://localhost'),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('deve conectar ao RabbitMQ', async () => {
    await service.onModuleInit();
    expect(service['connection']).not.toBeNull();
    expect(service['channel']).not.toBeNull();
  });
});

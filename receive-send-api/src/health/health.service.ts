import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, switchMap, tap } from 'rxjs';
import * as redis from 'redis';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private readonly authBaseUrl: string;
  private readonly recordBaseUrl: string;
  private readonly redisHost: string;
  private readonly redisPort: string;
  private readonly rabbitmqUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.authBaseUrl = this.config.get<string>('AUTH_API_BASE_URL') ?? '';
    this.recordBaseUrl = this.config.get<string>('RECORD_API_BASE_URL') ?? '';
    this.redisHost = this.config.get<string>('REDIS_HOST') ?? '';
    this.redisPort = this.config.get<string>('REDIS_PORT') ?? '';
    this.rabbitmqUrl = this.config.get<string>('RABBITMQ_URI') ?? '';

    if (!this.authBaseUrl || !this.recordBaseUrl || !this.redisHost || !this.redisPort || !this.rabbitmqUrl) {
      throw new Error('Erro: variáveis não definidas');
    }
  }
  async checkServices() {
    const results = {
      auth_api: false,
      record_api: false,
      redis: false,
      rabbitmq: false,
    };

    try {
      const res = await firstValueFrom(this.http.get(this.authBaseUrl + '/health'));
      results.auth_api = !!res.data?.isOnline;
    } catch {}

    try {
      const res = await firstValueFrom(this.http.get(this.recordBaseUrl + '/health'));
      results.record_api = res.data?.status === 'UP';
    } catch {}

    try {
      const client = redis.createClient({
        socket: {
          host: this.redisHost,
          port: parseInt(this.redisPort),
        },
      });
      await client.connect();
      await client.ping();
      results.redis = true;
      await client.disconnect();
    } catch (ex) {
      console.error(ex);
    }

    try {
      const conn = await amqp.connect(this.rabbitmqUrl);
      await conn.close();
      results.rabbitmq = true;
    } catch {}

    return {
      status: Object.values(results).every(Boolean) ? 'UP' : 'DEGRADED',
      detail: results,
    };
  }
}

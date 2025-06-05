import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as redis from 'redis';
import * as amqp from 'amqplib';

@Injectable()
export class HealthService {
  constructor(private readonly http: HttpService) {}

  async checkServices() {
    const results = {
      auth_api: false,
      record_api: false,
      redis: false,
      rabbitmq: false,
    };

    try {
      const res = await firstValueFrom(this.http.get(process.env.AUTH_API_URL || 'http://auth_api:8000/health'));
      results.auth_api = res.status === 200;
    } catch {}

    try {
      const res = await firstValueFrom(this.http.get(process.env.RECORD_API_URL || 'http://record_api:8000/health'));
      results.record_api = res.status === 200;
    } catch {}

    try {
      const client = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'redis',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      });
      await client.connect();
      await client.ping();
      results.redis = true;
      await client.disconnect();
    } catch {}

    try {
      const conn = await amqp.connect(`amqp://${process.env.RABBITMQ_HOST || 'rabbitmq'}`);
      await conn.close();
      results.rabbitmq = true;
    } catch {}

    return {
      status: Object.values(results).every(Boolean) ? 'UP' : 'DEGRADED',
      detail: results,
    };
  }
}

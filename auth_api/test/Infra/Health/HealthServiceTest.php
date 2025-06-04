<?php

namespace Thundera\AuthApi\Tests\Infra\Health;

use Medoo\Medoo;
use PHPUnit\Framework\TestCase;
use Thundera\AuthApi\Infra\Health\HealthService;
use Predis\Client as RedisClient;

final class HealthServiceTest extends TestCase
{
    private HealthService $healthService;
    private RedisClient $mockRedis;
    private Medoo $mockMedoo;

    protected function setUp(): void
    {
        $this->mockRedis = $this->createMock(RedisClient::class);
        $this->mockMedoo = $this->createMock(Medoo::class);
        $this->healthService = new HealthService($this->mockRedis, $this->mockMedoo);
    }

    public function testRedisHealthCheck()
    {
        $this->assertTrue($this->healthService->getRedisHealth(), "Redis health check failed.");
    }

    public function testDatabaseHealthCheck()
    {
        $this->assertTrue($this->healthService->getDatabaseHealth(), "Database health check failed.");
    }

    public function testOverallHealthCheck()
    {
        $this->assertInstanceOf(
            \Thundera\AuthApi\Infra\Health\Health::class,
            $this->healthService->getHealth(),
            "Health check should return Health instance."
        );
    }
}
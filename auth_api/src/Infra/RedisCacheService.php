<?php

namespace Thundera\AuthApi\Infra;

use Predis\Client as RedisClient;
use Thundera\AuthApi\Infra\CacheService;

class RedisCacheService implements CacheService {
    private RedisClient $redis;

    public function __construct(RedisClient $redis) 
    {
        $this->redis = $redis;
    }

    public function get(string $key): ?string {
        return $this->redis->get($key);
    }

    public function set(string $key, $value): void {
        $this->redis->set($key, $value);
        return;
    }
}
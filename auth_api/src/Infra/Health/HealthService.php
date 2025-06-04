<?php

namespace Thundera\AuthApi\Infra\Health;

use Exception;
use Medoo\Medoo;
use Predis\Client as RedisClient;

class HealthService {

    private RedisClient $redis;
    private Medoo $medoo;
    
    public function __construct(RedisClient $redis, Medoo $medoo)
    {
        $this->redis = $redis;
        $this->medoo = $medoo;
    }
    
    public function getHealth() {
        return new Health($this->getRedisHealth() && $this->getDatabaseHealth());
    }

    public function getRedisHealth() {
        try {
            $this->redis->ping();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getDatabaseHealth() {
        try {
            $this->medoo->query("SELECT 1");
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
} 
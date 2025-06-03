<?php

namespace Thundera\AuthApi\Infra;

interface CacheService {
    public function get(string $key): ?string;
    public function set(string $key, $value): void;
}


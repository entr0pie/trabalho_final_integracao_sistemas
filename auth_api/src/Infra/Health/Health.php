<?php

namespace Thundera\AuthApi\Infra\Health;

class Health
{
    public bool $isOnline;

    public function __construct(bool $isOnline)
    {
        $this->isOnline = $isOnline;
    }
}

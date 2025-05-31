<?php

use PHPUnit\Framework\TestCase;
use Thundera\AuthApi\Service\SumService;

final class SumServiceTest extends TestCase
{ 
    public function testShouldSumNumbers()
    {
        $service = new SumService();
        $this->assertEquals($service->sum(1, 2), 3);
    }
}
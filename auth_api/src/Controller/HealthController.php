<?php

namespace Thundera\AuthApi\Controller;

use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Thundera\AuthApi\Infra\Health\HealthService;

class HealthController
{
    private HealthService $health;

    public function __construct(HealthService $service)
    {
        $this->health = $service;
    }

    public function getHealth(Request $request, Response $response, array $args): Response
    {
        $health = $this->health->getHealth();
        $response->getBody()->write(json_encode($health));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
<?php

namespace Thundera\AuthApi\Controller;

use Thundera\AuthApi\Service\SumService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SumController 
{
    private $service;

    public function __construct(SumService $service)
    {
        $this->service = $service;
    }

    public function sum(Request $request, Response $response, $args)
    {
        $sum = $this->service->sum(1, 2);
        $response->getBody()->write((string) $sum);
        return $response;
    }

}
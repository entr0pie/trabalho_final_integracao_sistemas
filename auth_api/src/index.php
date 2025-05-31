<?php

namespace Thundera\AuthApi;

require __DIR__ . '/../vendor/autoload.php';

use Thundera\AuthApi\Service\SumService;
use Thundera\AuthApi\Controller\SumController;

$service = new SumService();
$controller = new SumController($service);

use Slim\Factory\AppFactory;

$app = AppFactory::create();

$app->get('/', [$controller, 'sum']);
$app->run();

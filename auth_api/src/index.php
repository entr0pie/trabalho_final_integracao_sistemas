<?php

namespace Thundera\AuthApi;

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Slim\Factory\AppFactory;
use Medoo\Medoo;
use Predis\Client as RedisClient;

use Thundera\AuthApi\Service\AuthServices;
use Thundera\AuthApi\Controller\AuthController;
use Thundera\AuthApi\Controller\HealthController;
use Thundera\AuthApi\Controller\UserController;
use Thundera\AuthApi\Infra\Health\HealthService;
use Thundera\AuthApi\Infra\RedisCacheService;
use Thundera\AuthApi\Repository\UserRepositoryImpl;
use Thundera\AuthApi\Service\UserService;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();


$database = new Medoo([
    'type' => 'pgsql',
    'host' =>  $_ENV['DATABASE_HOST'],
    'database' => $_ENV['DATABASE_SCHEMA'],
    'username' => $_ENV['DATABASE_USERNAME'],
    'password' => $_ENV['DATABASE_PASSWORD'],
    'port' => $_ENV['DATABASE_PORT'],
    'charset' => 'utf8'
]);

$redis = new RedisClient([
    'scheme' => 'tcp',
    'host'   => $_ENV['CACHE_HOST'],
    'port'   => $_ENV['CACHE_POST'],
]);


$app = AppFactory::create();
$app->addBodyParsingMiddleware();

$repository = new UserRepositoryImpl($database);
$cache = new RedisCacheService($redis);

$userService = new UserService($repository, $cache);
$userController = new UserController($userService);

$app->get('/user', [$userController, 'findUserByEmail']);
$app->post('/user', [$userController, 'createUser']);
$app->get('/users', [$userController, 'findAllUsers']);

$healthService = new HealthService($redis, $database);
$healthController = new HealthController($healthService);

$app->get('/health', [$healthController, 'getHealth']);

$secretKey = $_ENV['SECRET_KEY'];

$authService = new AuthServices($secretKey);
$authController = new AuthController($authService, $userService, $cache);

$app->get('/token', callable: [$authController, 'validateToken']);
$app->post('/token', [$authController, 'login']);

$app->run();

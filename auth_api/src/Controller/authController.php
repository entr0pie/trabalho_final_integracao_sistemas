<?php

namespace Thundera\AuthApi\Controller;

use Thundera\AuthApi\Service\AuthServices;
use Thundera\AuthApi\Infra\CacheService;
use Thundera\AuthApi\Service\UserService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    private $authService;
    private $userService;
    private CacheService $cache;

    #novo commit
    
    public function __construct(AuthServices $authService, UserService $userService, CacheService $cache)
    {
        $this->authService = $authService;
        $this->userService = $userService;
        $this->cache = $cache;
    }

    public function login(Request $request, Response $response) 
    {
        $email = $request->getParsedBody()['email'];
        $password = $request->getParsedBody()['password'];

        if(empty($email) || empty($password)) 
        {
            $response->getBody()->write(json_encode(['error' => 'Email e senha são obrigatórios']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        $user = $this->userService->findUserByEmail($email);

        if (!$user) 
        {
            $response->getBody()->write(json_encode(['error' => 'Usuário não encontrado']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }

        if($user->email === $email && $user->password === $password)
        {
            $token = $this->authService->generateJWT(['email' => $email]);
            $response->getBody()->write(json_encode(['token' => $token]));            
            return $response->withHeader('Content-Type', 'application/json', $email)->withStatus(200);
        }

    }

    public function validateToken(Request $request, Response $response)
    {
        $token = $request->getHeaderLine('Authorization');

        if (empty($token)) {
            $response->getBody()->write(json_encode(['error' => 'Token não fornecido']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        if(str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }

        $cachedData = $this->cache->get($token);
        if($cachedData) {
            $decoded = json_decode($cachedData, true);
            $response->getBody()->write(json_encode(['message' => 'Token válido']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        }

        try
        {
            $decoded = $this->authService->validateJWT($token);
            $response->getBody()->write(json_encode(['message' => 'Token válido']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

            $this->cache->set($decoded->email, json_encode($decoded));
        }
        catch (\Exception $e) 
        {
            $response->getBody()->write(json_encode(['error' => 'Token inválido ou expirado']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

    }


}
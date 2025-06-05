<?php

namespace Thundera\AuthApi\Controller;

use Thundera\AuthApi\Model\UserModel;
use Thundera\AuthApi\Service\UserService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class UserController {
    private UserService $service;

    public function __construct(UserService $service) {
        $this->service = $service;
    }

    public function findUserByEmail(Request $request, Response $response, array $args): Response
    {
        $queryParams = $request->getQueryParams();
        $email = $queryParams['email'] ?? null;
    
        if (!$email) {
            $error = ['error' => 'Email is required'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    
        $user = $this->service->findUserByEmail($email);
    
        if (!$user) {
            $error = ['error' => 'User not found'];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }
    
        $response->getBody()->write(json_encode($user));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function createUser(Request $request, Response $response, array $args) 
    {
        $body = json_decode($request->getBody()->getContents(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $response->getBody()->write(json_encode(['error' => 'Invalid JSON']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
        
        if (!isset($body['name'], $body['lastName'], $body['email'], $body['password'])) {
            $errorResponse = ['error' => 'Missing required fields'];
            $response->getBody()->write(json_encode($errorResponse));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    
        $user = new UserModel(
            $body['name'],
            $body['lastName'],
            $body['email'],
            $body['password']
        );
    
        $result = $this->service->createUser($user);
        $responseData = [
            'message' => 'ok',
            'user' => $result
        ];
    
        $response->getBody()->write(json_encode($responseData));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    public function findAllUsers(Request $request, Response $response, array $args): Response
    {
        $users = $this->service->findAllUsers();
        $response->getBody()->write(json_encode($users));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
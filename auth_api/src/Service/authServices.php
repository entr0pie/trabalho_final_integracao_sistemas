<?php

namespace Thundera\AuthApi\Service;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthServices
{
    private string $secretKey;

    public function __construct(string $secretKey) 
    {
        $this->secretKey = $secretKey;
    }

    public function generateJWT(array $payload): string 
    {
        if (!isset($payload['exp']))
        {
            $payload['exp'] = time() + 300;
        }


        return JWT::encode($payload, $this->secretKey, 'HS256');
    }

    public function validateJWT(string $token): object
    {
        try {
            return JWT::decode($token, new Key($this->secretKey, 'HS256'));
        }
        catch (Exception $e) {
            throw new Exception("Token inválido ou expirado");
        }
    }
}
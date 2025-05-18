<?php

namespace App\DTOs;

class UserDTO 
{
    public string $name;
    public ?string $last_name;
    public string $email;
    public string $password;

    public function __construct(array $data)
    {
        $this->name = $data['name'] ?? '';
        $this->last_name = $data['last_name'] ?? null;
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
    }
}
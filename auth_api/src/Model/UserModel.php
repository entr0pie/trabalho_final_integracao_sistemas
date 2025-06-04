<?php

namespace Thundera\AuthApi\Model;

final class UserModel {
    public int $user_id;
    public string $name;
    public string $lastName;
    public string $email;
    public string $password;

    public function __construct(string $name, string $lastName, string $email, string $password) {
        $this->name = $name;
        $this->lastName = $lastName;
        $this->email = $email;
        $this->password = $password;
    }
}
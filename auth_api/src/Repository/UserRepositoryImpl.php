<?php

namespace Thundera\AuthApi\Repository;

use Medoo\Medoo;
use Thundera\AuthApi\Model\UserModel;

class UserRepositoryImpl implements UserRepository {

    private Medoo $database;

    public function __construct(Medoo $medoo) {
        $this->database = $medoo;
    }
    
    public function createUser(UserModel $user): UserModel
    {
        $this->database->insert('user', [
            "name" => $user->name,
            "last_name" => $user->lastName,
            "email" => $user->email,
            "password" => $user->password,
        ]);
        
        return $user;
    }

    public function findUserByEmail(string $email): UserModel|null
    {
        $data = $this->database->get('user', '*', ['email' => $email]);

        if (!$data) {
            return null;
        }

        $user = new UserModel(
            $data['name'],
            $data['last_name'],
            $data['email'],
            $data['password']
        );

        $user->user_id = $data['user_id'];
        return $user;
    }
}
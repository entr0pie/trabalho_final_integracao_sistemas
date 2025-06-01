<?php

namespace Thundera\AuthApi\Repository;

use Thundera\AuthApi\Model\UserModel;

interface UserRepository {
    public function createUser(UserModel $user): UserModel;
    public function findUserByEmail(string $email): ?UserModel;
}

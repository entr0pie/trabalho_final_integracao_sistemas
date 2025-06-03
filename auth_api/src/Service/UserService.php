<?php

namespace Thundera\AuthApi\Service;

use Thundera\AuthApi\Infra\CacheService;
use Thundera\AuthApi\Model\UserModel;
use Thundera\AuthApi\Repository\UserRepository;

class UserService {

    private UserRepository $repository;
    private CacheService $cache;

    public function __construct(UserRepository $repository, CacheService $cache)
    {
        $this->repository = $repository;
        $this->cache = $cache;
    }

    public function createUser(UserModel $user): UserModel
    {
        return $this->repository->createUser($user);
    }

    public function findUserByEmail(string $email): ?UserModel
    {
        $cachedData = $this->cache->get($email);
        
        if ($cachedData) {
            $data = json_decode($cachedData, true);
            $user = new UserModel(
                $data['name'],
                $data['lastName'],
                $data['email'],
                $data['password'],
            );

            $user->user_id = $data['user_id'];
            return $user;
        }
    
        $user = $this->repository->findUserByEmail($email);
        if (!$user) {
            return null;
        }
    
        $this->cache->set($email, json_encode($user));   
        return $user;
    }

    public function findAllUsers(): array
    {
        $cachedData = $this->cache->get('all_users');
        
        if ($cachedData) {
            $data = json_decode($cachedData, true);
            $users = [];
            foreach ($data as $item) {
                $user = new UserModel(
                    $item['name'],
                    $item['lastName'],
                    $item['email'],
                    $item['password'],
                );
                $user->user_id = $item['user_id'];
                $users[] = $user;
            }
            return $users;
        }
    
        $users = $this->repository->findAllUsers();
        if (empty($users)) {
            return [];
        }
    
        $this->cache->set('all_users', json_encode($users));
        return $users;
    }
}
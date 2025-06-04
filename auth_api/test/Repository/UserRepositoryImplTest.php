<?php

namespace Thundera\AuthApi\Tests\Repository;

use PHPUnit\Framework\TestCase;
use Medoo\Medoo;
use Thundera\AuthApi\Model\UserModel;
use Thundera\AuthApi\Repository\UserRepositoryImpl;

final class UserRepositoryImplTest extends TestCase
{
    private Medoo $databaseMock;
    private UserRepositoryImpl $userRepository;

    protected function setUp(): void
    {
        $this->databaseMock = $this->createMock(Medoo::class);
        $this->userRepository = new UserRepositoryImpl($this->databaseMock);
    }

    public function testCreateUserInsertsDataCorrectly()
    {
        $user = new UserModel("John", "Doe", "john@example.com", "secret");

        $this->databaseMock->expects($this->once())
            ->method('insert')
            ->with('user', [
                "name" => "John",
                "last_name" => "Doe",
                "email" => "john@example.com",
                "password" => "secret"
            ]);

        $result = $this->userRepository->createUser($user);
        $this->assertSame($user, $result);
    }

    public function testFindUserByEmailReturnsUserIfExists()
    {
        $email = "john@example.com";
        $userData = [
            'user_id' => 1,
            'name' => 'John',
            'last_name' => 'Doe',
            'email' => $email,
            'password' => 'secret'
        ];

        $this->databaseMock->method('get')->willReturn($userData);

        $user = $this->userRepository->findUserByEmail($email);

        $this->assertInstanceOf(UserModel::class, $user);
        $this->assertSame(1, $user->user_id);
        $this->assertSame("John", $user->name);
        $this->assertSame("Doe", $user->lastName);
        $this->assertSame($email, $user->email);
        $this->assertSame("secret", $user->password);
    }

    public function testFindUserByEmailReturnsNullWhenNotFound()
    {
        $email = "nonexistent@example.com";

        $this->databaseMock->method('get')->willReturn(null);

        $user = $this->userRepository->findUserByEmail($email);

        $this->assertNull($user);
    }
}

<?php

namespace Thundera\AuthApi\Tests\Service;
use PHPUnit\Framework\TestCase;
use Thundera\AuthApi\Model\UserModel;
use Thundera\AuthApi\Repository\UserRepository;
use Thundera\AuthApi\Infra\CacheService;
use Thundera\AuthApi\Service\UserService;

final class UserServiceTest extends TestCase
{
    private UserRepository $repositoryMock;
    private CacheService $cacheMock;
    private UserService $userService;

    protected function setUp(): void
    {
        $this->repositoryMock = $this->createMock(UserRepository::class);
        $this->cacheMock = $this->createMock(CacheService::class);
        $this->userService = new UserService($this->repositoryMock, $this->cacheMock);
    }

    public function testCreateUserCallsRepositoryAndReturnsUser()
    {
        $user = new UserModel("John", "Doe", "john@example.com", "secret");

        $this->repositoryMock->expects($this->once())
            ->method('createUser')
            ->with($user)
            ->willReturn($user);

        $result = $this->userService->createUser($user);
        $this->assertSame($user, $result);
    }

    public function testFindUserByEmailReturnsCachedUserIfExists()
    {
        $email = "john@example.com";
        $cachedUserData = json_encode([
            'user_id' => 1,
            'name' => 'John',
            'lastName' => 'Doe',
            'email' => $email,
            'password' => 'secret'
        ]);

        $this->cacheMock->method('get')->willReturn($cachedUserData);

        $user = $this->userService->findUserByEmail($email);

        $this->assertInstanceOf(UserModel::class, $user);
        $this->assertSame(1, $user->user_id);
        $this->assertSame("John", $user->name);
        $this->assertSame("Doe", $user->lastName);
        $this->assertSame($email, $user->email);
        $this->assertSame("secret", $user->password);
    }

    public function testFindUserByEmailCachesUserAfterRetrievingFromRepository()
    {
        $email = "john@example.com";
        $user = new UserModel("John", "Doe", $email, "secret");
        $user->user_id = 1;

        $this->cacheMock->method('get')->willReturn(null);
        $this->repositoryMock->method('findUserByEmail')->willReturn($user);

        $this->cacheMock->expects($this->once())
            ->method('set')
            ->with($this->equalTo($email), $this->equalTo(json_encode($user)));

        $result = $this->userService->findUserByEmail($email);

        $this->assertSame($user, $result);
    }

    public function testFindUserByEmailReturnsNullWhenUserNotFound()
    {
        $email = "nonexistent@example.com";

        $this->cacheMock->method('get')->willReturn(null);
        $this->repositoryMock->method('findUserByEmail')->willReturn(null);

        $result = $this->userService->findUserByEmail($email);
        $this->assertNull($result);
    }
}

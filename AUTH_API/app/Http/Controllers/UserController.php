<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\DTOs\UserDTO;

class UserController extends Controller
{
    public function registerUser(Request $request)
    {
        $userDTO = new UserDTO($request->only(['name', 'last_name', 'email', 'password']));

        $user = new User();
        $user->name = $userDTO->name;
        $user->last_name = $userDTO->last_name;
        $user->email = $userDTO->email;
        $user->password = bcrypt($userDTO->password);
        $user->save();

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }
}

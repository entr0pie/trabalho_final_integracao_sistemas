<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

Route::post('/register', [UserController::class, 'registerUser']);
Route::post('/login', [AuthController::class, 'login']);
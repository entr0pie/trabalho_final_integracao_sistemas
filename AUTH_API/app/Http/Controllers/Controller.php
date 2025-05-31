<?php

namespace App\Http\Controllers;

use App\DTOs\UserDTO;

abstract class Controller
{
      protected function respondSuccess($data, $message = 'Success', $status = 200)
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    // Método comum para responder erro
    protected function respondError($message = 'Error', $status = 400)
    {
        return response()->json([
            'message' => $message,
        ], $status);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        session(['user_email' => $user->email]);

        return response()->json($user);
    }

    public function logout(Request $request)
    {
        session()->forget('user_email');
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $email = session('user_email');
        if (!$email) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }
}
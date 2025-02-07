<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!session()->has('user_email')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = \App\Models\User::where('email', session('user_email'))->first();

        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
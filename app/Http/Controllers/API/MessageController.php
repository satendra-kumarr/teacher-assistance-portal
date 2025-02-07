<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $message = $project->messages()->create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return response()->json($message->load('user'), 201);
    }

    public function markAsRead(Message $message)
    {
        $this->authorize('update', $message);

        $message->update(['is_read' => true]);

        return response()->json($message);
    }
}
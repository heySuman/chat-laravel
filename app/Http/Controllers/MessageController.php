<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $receiverId = $request->query('receiver_id');

        $messages = Message::where(function ($q) use ($receiverId) {
            $q->where('sender_id', auth()->id())
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($receiverId) {
            $q->where('sender_id', $receiverId)
                ->where('receiver_id', auth()->id());
        })->orderBy('created_at')->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $validated['receiver_id'],
            'message' => $validated['message'],
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
}

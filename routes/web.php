<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MessageController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('/chat/{user}', function (App\Models\User $user) {
        return Inertia::render('Chat/Show', [
            'receiverId' => $user->id,
            'users' => User::where('id', '!=', auth()->id())->get(),
        ]);
    })->name('chat.show');

    Route::get('/chat', function (App\Models\User $user) {
        return Inertia::render('Chat/Index', [
            'users' => User::where('id', '!=', auth()->id())->get(),
        ]);
    })->name('chat.index');
});

Broadcast::routes(['middleware' => ['auth', 'web']]);;

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

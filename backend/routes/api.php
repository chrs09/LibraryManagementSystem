<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function () {
    return response()->json(['message' => 'API route working']);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/books', [\App\Http\Controllers\BookController::class, 'index']);
    Route::post('/books', [\App\Http\Controllers\BookController::class, 'store']);
    Route::put('/books/{id}', [\App\Http\Controllers\BookController::class, 'update']);

    //Book Users (Members)
    Route::get('/users', [\App\Http\Controllers\BookUsersController::class, 'index']);
    Route::post('/users', [\App\Http\Controllers\BookUsersController::class, 'store']);
    Route::put('/users/{id}', [\App\Http\Controllers\BookUsersController::class, 'update']);

    //borrow records
    Route::post('/borrow-records', [\App\Http\Controllers\BorrowRecordsController::class, 'store']);
    Route::get('/borrowed-books', [\App\Http\Controllers\BorrowRecordsController::class, 'borrowedBooks']);

    Route::post('/logout', [AuthController::class, 'logout']);
});
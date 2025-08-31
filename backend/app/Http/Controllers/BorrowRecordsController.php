<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BorrowRecord;
use App\Models\Book;

class BorrowRecordsController extends Controller
{
    public function borrowedBooks(Request $request)
    {
        $user = $request->user();

        // If librarian, show all borrow records
        if ($user->role === 'librarian') {
            $borrows = BorrowRecord::with('book', 'book_user')->get();
        } else {
            // If member, show only their borrow records
            $borrows = BorrowRecord::with('book')
                ->where('user_id', $user->id)
                ->get();
        }

        return response()->json($borrows);
    }
    //

    public function store(Request $request)
    {
        
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:book_users,id',
            'borrowed_at' => 'required|date',
            'due_at' => 'required|date',
        ]);

        // Create borrow record
        $borrow = BorrowRecord::create($request->all());

        // Update book status
        $book = Book::find($request->book_id);
        $book->status = 'not available';
        $book->save();

        return response()->json($borrow, 201);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookController extends Controller
{
    // fetching of book list
    public function index()
    {
        
        $books = \App\Models\Book::orderBy('created_at', 'desc')->get();
        return response()->json($books);

    }
    // post method to add a new book
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'required|string|max:13|unique:books,isbn',
            'published_date' => 'required|date',
        ]);
        $book = \App\Models\Book::create($request->all());
        return response()->json($book, 201);

    }

    //update book
    public function update(Request $request, $id)
    {
        $book = \App\Models\Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'isbn' => 'sometimes|required|string|max:13|unique:books,isbn,' . $id,
            'published_date' => 'sometimes|required|date',
        ]);
        $book->update($request->all());
        return response()->json($book);
    }
}

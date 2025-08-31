<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookUser;
use Illuminate\Support\Facades\Hash;
class BookUsersController extends Controller
{
    public function index()
    {
        return response()->json(BookUser::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:book_users,email',
            'password' => 'required|string|min:6',
            // 'role' => 'member', // validate role
        ]);

        $user = BookUser::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            // 'role' => $validated['role'],
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = BookUser::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:book_users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|string', // <-- optional
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        // Only update role if it was sent
        if (isset($validated['role'])) {
            $user->role = $validated['role'];
        }

        $user->save();

        return response()->json($user);
    }


}

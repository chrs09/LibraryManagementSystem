<?php

namespace App\Models;

use Illuminate\Container\Attributes\Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//namespace for auth/user as authenticatable
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class BookUser extends Authenticatable
{
    use HasApiTokens,HasFactory, Notifiable;

    // Allow mass assignment for these fields
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // optional, only needed if you allow editing role
    ];

    // Optional: hide password when returning JSON
    protected $hidden = ['password'];

    public function borrowRecords()
    {
        return $this->hasMany(BorrowRecord::class, 'user_id');
    }
    
}

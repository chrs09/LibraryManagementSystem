<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'book_id',
        'user_id',
        'borrowed_at',
        'due_at',
        'returned_at',
    ];
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
    public function book_user()
    {
        return $this->belongsTo(BookUser::class, 'user_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'published_date',
    ];

    public function borrowRecords()
    {
        return $this->hasMany(BorrowRecord::class, 'book_id');
    }
}

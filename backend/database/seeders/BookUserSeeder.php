<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //create default admin user
        \App\Models\BookUser::firstOrCreate(
            ['email' => 'admin@email.com'], 
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'), 
                'role' => 'librarian', 
            ]
        );

            
        
        //generate 10 book users
        \App\Models\BookUser::factory()->count(10)->create();
        
        //how to run seeders
        //php artisan db:seed --class=BookUserSeeder
        //php artisan db:seed --class=BookSeeder
        //php artisan db:seed --class=BorrowRecordSeeder
    }
}

<?php

namespace Modules\Category\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Category\Models\Category;

class CategoryDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::factory(10)->create();

        foreach ($categories as $category) {
            if (rand(0, 1)) {
                $category->parent_id = $categories->random()->id;
                $category->save();
            }
        }
    }
}

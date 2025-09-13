<?php

namespace Modules\Category\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Category\Models\Category;

class CategoryController extends Controller
{
    // لیست دسته‌بندی‌ها با پیجینیشن
    public function index()
    {
        $categories = Category::with('children')->paginate(10);
        return response()->json($categories);
    }

    // ایجاد دسته‌بندی جدید
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category = Category::create($request->all());

        return response()->json(['message' => 'Category created successfully.', 'category' => $category], 201);
    }

    // نمایش یک دسته‌بندی خاص
    public function show($id)
    {
        $category = Category::with('children')->findOrFail($id);
        return response()->json($category);
    }

    // ویرایش دسته‌بندی
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories,slug,' . $category->id,
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $category->update($request->all());

        return response()->json(['message' => 'Category updated successfully.', 'category' => $category]);
    }

    // حذف دسته‌بندی
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }
}
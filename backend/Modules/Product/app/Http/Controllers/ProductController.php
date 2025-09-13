<?php

namespace Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Product\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * لیست محصولات
     */
    public function index()
    {
        $oldestProducts = Product::with(['category', 'images'])
            ->orderBy('created_at', 'asc')
            ->paginate(10);

        $newestProducts = Product::with(['category', 'images'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'oldest_products' => $oldestProducts,
            'newest_products' => $newestProducts
        ], 200);
    }

    /**
     * ایجاد محصول جدید
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $product = Product::create($request->except('images'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $index === 0
                ]);
            }
        }

        return response()->json([
            'message' => 'Product created successfully', 
            'product' => $product->load(['category', 'images'])
        ], 201);
    }

    /**
     * نمایش اطلاعات محصول
     */
    public function show($id)
    {
        $product = Product::with(['category', 'images'])->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(['product' => $product], 200);
    }

    /**
     * ویرایش محصول
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'category_id' => 'nullable|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'exists:product_images,id'
        ]);

        $product->update($request->except(['images', 'remove_images']));

        // حذف تصاویر انتخاب شده
        if ($request->has('remove_images')) {
            foreach ($product->images()->whereIn('id', $request->remove_images)->get() as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }
        }

        // افزودن تصاویر جدید
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $product->images()->count() === 0
                ]);
            }
        }

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load(['category', 'images'])
        ], 200);
    }

    /**
     * حذف محصول
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // حذف تصاویر از storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    /**
     * جستجو و فیلتر محصولات
     */
    public function search(Request $request)
    {
        $query = Product::with(['category', 'images']);

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->paginate(10);

        return response()->json(['products' => $products], 200);
    }

    /**
     * تنظیم تصویر اصلی محصول
     */
    public function setPrimaryImage(Request $request, $productId, $imageId)
    {
        $product = Product::findOrFail($productId);
        
        // حذف وضعیت primary از همه تصاویر محصول
        $product->images()->update(['is_primary' => false]);
        
        // تنظیم تصویر جدید به عنوان primary
        $product->images()->where('id', $imageId)->update(['is_primary' => true]);

        return response()->json([
            'message' => 'Primary image updated successfully',
            'product' => $product->load('images')
        ]);
    }
}
<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Modules\Product\Models\Product;

class AdminProductController extends Controller
{
    protected function disk(): string
    {
        return value(config('filesystems.admin_disk'));
    }

    public function index(Request $request): JsonResponse
    {
        $products = Product::with(['category', 'images'])
            ->latest()
            ->paginate(20);
        return response()->json(['products' => $products], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('tenants/' . ($request->user()->tenant_id ?? 'global') . '/products', $this->disk());
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $index === 0
                ]);
            }
        }

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load(['category', 'images']),
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['product' => $product->load(['category', 'images'])], 200);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'category_id' => 'required|exists:categories,id',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'exists:product_images,id'
            ]);
            DB::beginTransaction();

            if (! $product->update($validated)) {
                throw new \Exception('Failed to update product');
            }

            if ($request->has('deleted_images')) {
                foreach ($request->deleted_images as $imageId) {
                    $image = $product->images()->find($imageId);
                    if ($image) {
                        Storage::disk($this->disk())->delete($image->image_path);
                        $image->delete();
                    }
                }
            }

            if ($request->hasFile('images')) {
                $hasPrimaryImage = $product->images()->where('is_primary', true)->exists();
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('tenants/' . ($request->user()->tenant_id ?? 'global') . '/products', $this->disk());
                    $product->images()->create([
                        'image_path' => $path,
                        'is_primary' => !$hasPrimaryImage && $index === 0
                    ]);
                }
            }

            DB::commit();
            $product->load(['category', 'images']);
            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $product,
            ], 200);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Validation error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'An error occurred while updating the product', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Product $product): JsonResponse
    {
        $disk = $this->disk();
        $product->images->each(function ($image) use ($disk) {
            Storage::disk($disk)->delete($image->image_path);
        });
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }

    public function setPrimaryImage(Product $product, int $imageId): JsonResponse
    {
        $image = $product->images()->findOrFail($imageId);
        $product->images()->update(['is_primary' => false]);
        $image->update(['is_primary' => true]);
        return response()->json([
            'message' => 'Primary image updated successfully',
            'product' => $product->load('images'),
        ]);
    }

    public function toggleStatus(Product $product): JsonResponse
    {
        $product->update(['is_active' => ! $product->is_active]);
        return response()->json([
            'message' => 'Product status updated successfully',
            'status' => $product->is_active,
        ], 200);
    }
}

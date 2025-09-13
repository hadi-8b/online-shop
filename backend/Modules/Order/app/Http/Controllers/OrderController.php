<?php


namespace Modules\Order\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Order\Models\Order;

class OrderController extends Controller
{
    /**
     * ایجاد سفارش توسط کاربر
     */
    public function store(Request $request)
    {
        $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
        ]);

        $order = Order::create([
            'user_id' => auth()->id(),
            'total_price' => $request->total_price,
            'status' => 'pending', // وضعیت اولیه سفارش
        ]);

        foreach ($request->products as $product) {
            $order->products()->attach($product['id'], ['quantity' => $product['quantity']]);
        }

        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
    }

    /**
     * لیست سفارشات (فقط برای ادمین)
     */
    public function index()
    {
        $orders = Order::with('products')->paginate(10);
        return response()->json(['orders' => $orders], 200);
    }

    /**
     * تغییر وضعیت سفارش
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,completed,canceled',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json(['message' => 'Order status updated successfully'], 200);
    }
}
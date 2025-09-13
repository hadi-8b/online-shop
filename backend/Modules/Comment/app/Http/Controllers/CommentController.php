<?php

namespace Modules\Comment\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Comment\Models\Comment;
use Modules\Product\Models\Product;

class CommentController extends Controller
{

    public function index()
    {
        // کد متد index اینجا قرار می‌گیرد
        return view('comment::index');
    }
    /**
     * ارسال نظر توسط کاربر
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'content' => $request->content,
            'is_approved' => false, // نظر به صورت پیش‌فرض تأیید نشده است
        ]);

        return response()->json(['message' => 'Comment submitted successfully', 'comment' => $comment], 201);
    }

    /**
     * دریافت نظرات تأییدشده برای یک محصول
     */
    public function getCommentsByProduct($productId)
    {
        $comments = Comment::where('product_id', $productId)
            ->where('is_approved', true)
            ->get();

        return response()->json(['comments' => $comments], 200);
    }

    /**
     * تأیید نظر توسط ادمین
     */
    public function approve($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->update(['is_approved' => true]);

        return response()->json(['message' => 'Comment approved successfully'], 200);
    }

    /**
     * حذف نظر توسط ادمین
     */
    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }
}

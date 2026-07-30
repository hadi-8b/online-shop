<?php


namespace Modules\Cart\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Modules\Cart\Http\Requests\AddToCartRequest;
use Modules\Cart\Models\CartItem;
use Modules\Cart\Http\Requests\UpdateCartRequest;
use Modules\Product\Models\Product;
use Symfony\Component\HttpFoundation\Response;
use Modules\Cart\Services\CartService;

class CartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Get cart items
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $guestId = request()->header('X-Guest-ID');

        try {
            $cartData = $this->cartService->getCart($user, $guestId);
            return response()->json($cartData, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Add item to cart
     */
    public function add(AddToCartRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // اطمینان از integer بودن quantity
            $quantity = (int) $validated['quantity'];
            $productId = (int) $validated['product_id'];

            $user = Auth::user();
            $guestId = $request->header('X-Guest-ID');

            $product = Product::findOrFail($productId);

            $result = $this->cartService->addToCart(
                $product,
                $quantity,
                $user,
                $guestId
            );

            return response()->json($result, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Remove item from cart
     */
    public function remove(int $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $guestId = request()->header('X-Guest-ID');

            $query = CartItem::query()->where('id', $id);

            if ($user) {
                $query->where('user_id', $user->id);
            } elseif ($guestId) {
                $query->where('guest_id', $guestId);
            } else {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $cartItem = $query->firstOrFail();

            $this->cartService->removeItem($cartItem, $user, $user ? null : $guestId);

            return response()->json([
                'message' => 'Cart item removed successfully',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(UpdateCartRequest $request, int $id): JsonResponse
    {
        try {
            $user = Auth::user();
            $guestId = $request->header('X-Guest-ID');
            $validated = $request->validated();

            $query = CartItem::query()->where('id', $id);

            if ($user) {
                $query->where('user_id', $user->id);
            } elseif ($guestId) {
                $query->where('guest_id', $guestId);
            } else {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $cartItem = $query->firstOrFail();

            $updatedItem = $this->cartService->updateQuantity(
                $cartItem,
                (int) $validated['quantity'],
                $user,
                $user ? null : $guestId
            );

            return response()->json([
                'message' => 'Cart item updated successfully',
                'cart_item' => $updatedItem,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }
}

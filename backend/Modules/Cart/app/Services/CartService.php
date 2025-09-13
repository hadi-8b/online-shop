<?php

namespace Modules\Cart\Services;

use Illuminate\Support\Str;
use Modules\Cart\Models\CartItem;
use Modules\Product\Models\Product;
use Modules\User\Models\User;

class CartService
{
    /**
     * Get cart items for a user or guest
     */
    public function getCart(?User $user, ?string $guestId = null): array
    {
        $query = CartItem::query()
            ->with(['product:id,title,price,stock','product.images']);

        if ($user) {
            $query->where('user_id', $user->id);
        } elseif ($guestId) {
            $query->where('guest_id', $guestId);
        }

        $items = $query->get();

        $total = $items->reduce(function ($carry, $item) {
            return $carry + ($item->price * $item->quantity);
        }, 0);

        return [
            'items' => $items,
            'total' => $total,
            'count' => $items->sum('quantity')
        ];
    }

    /**
     * Add item to cart
     */
    public function addToCart(
        Product $product,
        int $quantity,
        ?User $user = null,
        ?string $guestId = null
    ): CartItem {
        // اطمینان از مثبت بودن quantity
        if ($quantity <= 0) {
            throw new \InvalidArgumentException('Quantity must be greater than zero');
        }

        if (!$user && !$guestId) {
            $guestId = Str::uuid()->toString();
        }

        if ($product->stock < $quantity) {
            throw new \Exception('Insufficient stock available');
        }

        $cartItem = CartItem::where([
            'user_id' => $user?->id,
            'guest_id' => $guestId,
            'product_id' => $product->id,
        ])->first();

        if ($cartItem) {
            $newQuantity = min($cartItem->quantity + $quantity, $product->stock);
            $cartItem->update([
                'quantity' => $newQuantity,
                'price' => $product->price,
            ]);
        } else {
            $cartItem = CartItem::create([
                'user_id' => $user?->id,
                'guest_id' => $guestId,
                'product_id' => $product->id,
                'quantity' => min($quantity, $product->stock),
                'price' => $product->price,
            ]);
        }

        return $cartItem->load('product:id,title,price,stock', 'product.images');
    }

    /**
     * Transfer guest cart to user
     */
    public function transferGuestCartToUser(string $guestId, User $user): void
    {
        CartItem::where('guest_id', $guestId)
            ->update([
                'user_id' => $user->id,
                'guest_id' => null
            ]);
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity(
        CartItem $cartItem,
        int $quantity,
        ?User $user = null,
        ?string $guestId = null
    ): CartItem {
        if (($user && $cartItem->user_id !== $user->id) ||
            ($guestId && $cartItem->guest_id !== $guestId)
        ) {
            throw new \Exception('Unauthorized access to cart item');
        }

        if ($cartItem->product->stock < $quantity) {
            throw new \Exception('Requested quantity not available in stock');
        }

        $cartItem->update(['quantity' => $quantity]);

        return $cartItem->load('product:id,title,price,stock', 'product.images');
    }

    /**
     * Remove item from cart
     */
    public function removeItem(
        CartItem $cartItem,
        ?User $user = null,
        ?string $guestId = null
    ): void {
        if (($user && $cartItem->user_id !== $user->id) ||
            ($guestId && $cartItem->guest_id !== $guestId)
        ) {
            throw new \Exception('Unauthorized access to cart item');
        }

        $cartItem->delete();
    }
}

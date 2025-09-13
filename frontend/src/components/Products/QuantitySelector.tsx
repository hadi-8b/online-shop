// src/components/Products/QuantitySelector.tsx
'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
  max: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({ max, onQuantityChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= max) {
      setQuantity(value);
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-3 space-x-reverse">
      <span className="text-gray-600">تعداد:</span>
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={max}
          value={quantity}
          onChange={handleInputChange}
          className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}
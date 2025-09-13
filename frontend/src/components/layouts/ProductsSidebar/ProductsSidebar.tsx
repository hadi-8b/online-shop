// src/components/layouts/ProductsSidebar/ProductsSidebar.tsx
import React from 'react';

const ProductsSidebar = () => {
  const topBestModels = [
    { name: 'در ابتدای طراحی', price: '35', rating: 4.5, image: '/images/products/9pr.png' },
    { name: 'ساخت به عنصر', price: '20', rating: 4.0, image: '/images/products/10pr.png' },
    { name: 'طراحی ساده و بدون پیچیدگی', price: '25', rating: 5.0, image: '/images/products/11pr.png' },
    { name: 'طراحی هماهنگ و متوازن', price: '30', rating: 3.5, image: '/images/products/12pr.png' },
  ];

  const youMayLike = [
    { name: 'حرکت در فرآیند', price: '30', image: '/images/products/13pr.png' },
    { name: 'ساخت به عنصر', price: '20', image: '/images/products/14pr.png' },
    { name: 'طراحی هماهنگ و متوازن', price: '25', image: '/images/products/15pr.png' },
  ];

  return (
    <aside className="bg-white p-4 shadow rounded-lg w-full">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">بهترین مدل‌ها</h3>
        <ul>
          {topBestModels.map((model, index) => (
            <li key={index} className="flex items-center mb-4">
              <img src={model.image} alt={model.name} className="w-12 h-12 rounded object-cover mr-4" />
              <div>
                <p className="text-gray-800 font-medium">{model.name}</p>
                <p className="text-yellow-500 text-sm">{'⭐'.repeat(Math.round(model.rating))}</p>
                <p className="text-gray-600 text-sm">{model.price} تومان</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">شاید بپسندید</h3>
        <ul>
          {youMayLike.map((item, index) => (
            <li key={index} className="flex items-center mb-4">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover mr-4" />
              <div>
                <p className="text-gray-800 font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.price} تومان</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ProductsSidebar;

// src/app/products/[id]/loading.tsx
export default function Loading() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* بخش تصویر */}
          <div className="p-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
  
          {/* بخش اطلاعات */}
          <div className="p-8 space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
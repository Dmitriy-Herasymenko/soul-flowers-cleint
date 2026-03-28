'use client';

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Категорії</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
          Немає категорій
        </div>
      </div>
    </div>
  );
}

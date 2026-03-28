'use client';

export default function ProductsPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Продукти</h2>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Назва</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ціна</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Немає продуктів
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

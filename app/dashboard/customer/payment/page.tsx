'use client';

export default function PaymentPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Оплата</h2>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Способи оплати</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Банківська карта</p>
                <p className="text-sm text-gray-600">Visa, Mastercard</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏦</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Банківський переказ</p>
                <p className="text-sm text-gray-600">Прямий переказ на рахунок</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

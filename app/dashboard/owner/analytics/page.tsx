'use client';

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Статистика</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-80">Загальний дохід</p>
          <p className="text-3xl font-bold mt-2">₴0</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-80">Замовлення</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-80">Користувачі</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-80">Товари</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { BarChart3, ShoppingCart, Users, Package } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isOwner, isAdmin, isCustomer, user } = useAuthStore();

  const stats = [
    { name: 'Замовлення', value: '0', icon: Package, color: 'bg-blue-500' },
    { name: 'Сума замовлень', value: '₴0', icon: ShoppingCart, color: 'bg-green-500' },
  ];

  if (isOwner) {
    stats.push(
      { name: 'Користувачі', value: '0', icon: Users, color: 'bg-purple-500' },
      { name: 'Дохід', value: '₴0', icon: BarChart3, color: 'bg-pink-500' }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Ласкаво просимо, {user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Швидкі дії</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/products')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900">Каталог квітів</h3>
            <p className="text-sm text-gray-600 mt-1">Переглянути всі товари</p>
          </button>

          {isOwner && (
            <button
              onClick={() => router.push('/dashboard/users')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Користувачі</h3>
              <p className="text-sm text-gray-600 mt-1">Управління користувачами</p>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => router.push('/dashboard/products')}
              className="p-4 text-left border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Продукти</h3>
              <p className="text-sm text-gray-600 mt-1">Управління товарами</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

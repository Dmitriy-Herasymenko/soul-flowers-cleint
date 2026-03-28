'use client';

import { AuthGuard } from '@/components/auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Users, Settings, LayoutDashboard, Package, ShoppingCart, User } from 'lucide-react';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isOwner, isAuthenticated, checkAuth } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    checkAuth();
    setIsLoaded(true);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Статистика', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Користувачі', href: '/dashboard/users', icon: Users },
    { name: 'Замовлення', href: '/dashboard/orders', icon: Package },
    { name: 'Налаштування', href: '/dashboard/settings', icon: Settings },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isOwner) {
    return null;
  }

  return (
    <AuthGuard requiredRole="owner">
      <div className="space-y-6">
        {/* Owner Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <p className="text-purple-100 mt-1">Панель управління власника</p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all"
              >
                <Icon size={24} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700 text-center">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}

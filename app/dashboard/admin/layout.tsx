'use client';

import { AuthGuard } from '@/components/auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package, Users } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isAuthenticated, checkAuth } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    checkAuth();
    setIsLoaded(true);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Продукти', href: '/dashboard/products', icon: ShoppingCart },
    { name: 'Категорії', href: '/dashboard/categories', icon: Package },
    { name: 'Замовлення', href: '/dashboard/orders', icon: Users },
  ];

  if (!isLoaded) {
    return null;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-blue-100 mt-1">Панель управління адміністратора</p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <Icon size={24} className="text-blue-600" />
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

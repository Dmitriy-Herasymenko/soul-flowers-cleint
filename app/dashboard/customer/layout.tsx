'use client';

import { AuthGuard } from '@/components/auth-guard';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, User, CreditCard } from 'lucide-react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCustomer, isAuthenticated, checkAuth } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    checkAuth();
    setIsLoaded(true);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Мої замовлення', href: '/dashboard/orders', icon: Package },
    { name: 'Оплата', href: '/dashboard/payment', icon: CreditCard },
    { name: 'Профіль', href: '/dashboard/profile', icon: User },
  ];

  if (!isLoaded) {
    return null;
  }

  if (!isAuthenticated || !isCustomer) {
    return null;
  }

  return (
    <AuthGuard requiredRole="customer">
      <div className="space-y-6">
        {/* Customer Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold">Customer Dashboard</h1>
          <p className="text-green-100 mt-1">Особистий кабінет клієнта</p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
              >
                <Icon size={24} className="text-green-600" />
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

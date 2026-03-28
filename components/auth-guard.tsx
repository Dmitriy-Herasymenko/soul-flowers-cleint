'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'admin' | 'customer';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, checkAuth, isOwner, isAdmin, isCustomer } = useAuthStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    checkAuth();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoaded, router]);

  // Перевірка ролі
  useEffect(() => {
    if (isLoaded && isAuthenticated && requiredRole) {
      const hasRole =
        (requiredRole === 'owner' && isOwner) ||
        (requiredRole === 'admin' && isAdmin) ||
        (requiredRole === 'customer' && isCustomer);

      if (!hasRole) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoaded, requiredRole, isOwner, isAdmin, isCustomer, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-pink-50/30 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole) {
    const hasRole =
      (requiredRole === 'owner' && isOwner) ||
      (requiredRole === 'admin' && isAdmin) ||
      (requiredRole === 'customer' && isCustomer);

    if (!hasRole) {
      return null;
    }
  }

  return <>{children}</>;
}

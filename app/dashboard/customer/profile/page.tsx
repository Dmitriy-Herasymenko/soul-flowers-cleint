'use client';

import { useAuthStore } from '@/stores/auth-store';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Профіль</h2>
      <div className="max-w-2xl bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              {user?.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              {user?.roles?.join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

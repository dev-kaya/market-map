'use client';

import { useEffect, useState } from 'react';
import { getSession, signOut } from '@/lib/auth';

export default function Header() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      setUser(session?.user || null);
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Market Map</h1>
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-gray-900">Market Map</h1>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <a
                href="/signup"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
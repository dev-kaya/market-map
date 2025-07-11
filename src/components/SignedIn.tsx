'use client';

import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';

interface SignedInProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  redirectTo?: string;
}

export default function SignedIn({ children, fallback: Fallback, redirectTo = '/signup' }: SignedInProps) {
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated && typeof window !== 'undefined') {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `${redirectTo}?next=${currentUrl}`;
    }
  }, [authenticated, redirectTo]);

  if (!authenticated) {
    if (Fallback) {
      return <Fallback />;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600">Redirecting to sign up...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
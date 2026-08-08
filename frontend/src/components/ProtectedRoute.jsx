'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from '@/src/store/useAuthStore';

/**
 * Protected Route Wrapper
 * 
 * Intercepts unauthenticated users and redirects them to the login page.
 * Uses a hydration-safe pattern to prevent server-client rendering mismatches.
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && (!isAuthenticated || !token)) {
      toast.error('Please login to access this page', { id: 'protected-route-toast' });
      router.replace('/login');
    }
  }, [isMounted, isAuthenticated, token, router]);

  // Prevent rendering anything while hydration occurs or while redirecting
  if (!isMounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted text-sm tracking-widest uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If authenticated and mounted, render the protected content
  return <>{children}</>;
}

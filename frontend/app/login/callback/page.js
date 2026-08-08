'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/src/store/useAuthStore';
import toast from 'react-hot-toast';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      setToken(token);
      toast.success('Successfully logged in!');
      router.replace('/dashboard');
    } else {
      toast.error('Authentication failed');
      router.replace('/login');
    }
  }, [searchParams, router, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted text-sm tracking-widest uppercase">Completing Login...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

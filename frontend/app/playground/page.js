'use client';

import dynamic from 'next/dynamic';
import SpaceBackground from '@/components/SpaceBackground';
import ProtectedRoute from '@/src/components/ProtectedRoute';

const PlaygroundLayout = dynamic(() => import('@/components/playground/PlaygroundLayout'), {
  ssr: false, // Monaco Editor requires the browser environment
  loading: () => <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#050508] border border-white/10 rounded-xl">Loading Sandbox Engine...</div>
});

export default function PlaygroundPage() {
  return (
    <ProtectedRoute>
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 lg:p-8 pt-24 lg:pt-28 overflow-hidden">
      <SpaceBackground />
      
      <div className="w-full max-w-7xl h-[80vh] min-h-[600px] relative z-10 flex flex-col">
        {/* Playground Header */}
        <div className="mb-4 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-white tracking-wide">Interactive Sandbox</h1>
          <p className="text-muted mt-1">Write, execute, and test code in real-time inside secure isolated containers.</p>
        </div>

        {/* The Editor Layout */}
        <div className="flex-1 min-h-0">
          <PlaygroundLayout />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

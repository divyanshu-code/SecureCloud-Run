'use client';

import dynamic from 'next/dynamic';
import SpaceBackground from '@/components/SpaceBackground';

const InteractiveMap = dynamic(() => import('@/components/architecture/InteractiveMap'), {
  ssr: false, // React Flow heavily relies on window and DOM, safe to disable SSR here
  loading: () => <div className="w-full h-full flex items-center justify-center text-gray-400">Loading Map Engine...</div>
});

export default function ArchitecturePage() {
  return (
    <div className="relative flex flex-col min-h-screen pt-24 lg:pt-28 pb-0 overflow-hidden">
      <SpaceBackground />

      <div className="w-full flex-1 relative z-10 flex mt-10 lg:mt-0 flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 mb-4 max-w-7xl mx-auto w-full text-center lg:text-left">
          <h1 className="text-3xl font-bold text-white tracking-wide">Interactive Architecture</h1>
          <p className="text-muted mt-1">Explore our distributed execution pipeline. Click on any node for technical details.</p>
        </div>

        {/* The Interactive React Flow Canvas */}
        <div className="w-full relative h-[80vh] min-h-[600px] border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <InteractiveMap />
        </div>
      </div>
    </div>
  );
}

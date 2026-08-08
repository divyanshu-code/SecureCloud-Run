'use client';

import { useState } from 'react';
import SpaceBackground from '@/components/SpaceBackground';
import Sidebar from '@/components/docs/Sidebar';
import DocContent from '@/components/docs/DocContent';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className="relative min-h-screen pt-24 lg:pt-32 pb-12 flex flex-col">
      <SpaceBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-1 flex flex-col lg:flex-row items-start">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <DocContent activeSection={activeSection} />
      </div>
    </div>
  );
}

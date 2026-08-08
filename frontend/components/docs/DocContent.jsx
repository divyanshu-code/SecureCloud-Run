'use client';

import { motion } from 'framer-motion';
import IntroSection from './sections/IntroSection';
import ArchitectureSection from './sections/ArchitectureSection';
import TechStackSection from './sections/TechStackSection';
import FlowSection from './sections/FlowSection';
import QueueSystemSection from './sections/QueueSystemSection';
import SecuritySection from './sections/SecuritySection';
import DatabaseSection from './sections/DatabaseSection';
import DeploymentSection from './sections/DeploymentSection';
import RoadmapSection from './sections/RoadmapSection';
import FaqSection from './sections/FaqSection';

export default function DocContent({ activeSection }) {

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return <IntroSection />;
      case 'architecture':
        return <ArchitectureSection />;
      case 'techstack':
        return <TechStackSection />;
      case 'flow':
        return <FlowSection />;
      case 'queue':
        return <QueueSystemSection />;
      case 'security':
        return <SecuritySection />;
      case 'database':
        return <DatabaseSection />;
      case 'deployment':
        return <DeploymentSection />;
      case 'roadmap':
        return <RoadmapSection />;
      case 'faq':
        return <FaqSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-24">
      {renderContent()}
    </div>
  );
}

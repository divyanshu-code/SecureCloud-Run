'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Monitor, Network, Database, Cpu, Box, TerminalSquare } from 'lucide-react';

const iconMap = {
  Monitor,
  Network,
  Database,
  Cpu,
  Box,
  TerminalSquare
};

const CustomNode = ({ data, selected }) => {
  const Icon = iconMap[data.iconName] || Box;

  return (
    <div 
      className={`relative group rounded-xl p-4 min-w-[220px] backdrop-blur-xl border transition-all duration-300
        ${selected 
          ? `bg-[#1a1a24] shadow-glow-primary border-primary` 
          : `bg-[#0a0a0f]/80 hover:bg-[#11111a] shadow-lg ${data.borderClass || 'border-white/10'}`
        }
      `}
    >
      {/* Node Content */}
      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-3 rounded-lg flex items-center justify-center ${data.glowClass || 'bg-white/5'} ${data.colorClass || 'text-white'}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm tracking-wide">{data.label}</h3>
          <p className="text-xs text-muted mt-0.5">{data.subline}</p>
        </div>
      </div>

      {/* Handles for edges */}
      {data.handles?.map((handle, idx) => (
        <Handle
          key={idx}
          type={handle.type}
          position={handle.position === 'top' ? Position.Top : handle.position === 'bottom' ? Position.Bottom : handle.position === 'left' ? Position.Left : Position.Right}
          id={handle.id}
          className="w-2 h-2 bg-accent border-none"
        />
      ))}
    </div>
  );
};

export default memo(CustomNode);

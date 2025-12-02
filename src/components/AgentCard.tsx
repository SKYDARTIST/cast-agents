import React from 'react';
import { AgentConfig } from '../types';
import { Wallet, ArrowRightLeft, Radar, TrendingUp, Play, BadgeCheck, Shuffle } from 'lucide-react';

interface AgentCardProps {
  agent: AgentConfig;
  onSelect: (agent: AgentConfig) => void;
}

const IconMap: Record<string, React.FC<any>> = {
  Wallet,
  ArrowRightLeft,
  Radar,
  TrendingUp,
  BadgeCheck,
  Shuffle
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect }) => {
  const Icon = IconMap[agent.icon] || Wallet;

  return (
    <div className="group relative bg-surface border border-surfaceHighlight rounded-xl p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} />
        </div>
        <span className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
          AI Agent
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-textMain mb-2">{agent.name}</h3>
      <p className="text-textMuted text-sm mb-4 flex-1 leading-relaxed">
        {agent.description}
      </p>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap, i) => (
                <span key={i} className="text-[10px] uppercase tracking-wider font-semibold text-textMuted bg-background px-2 py-1 rounded border border-surfaceHighlight">
                    {cap}
                </span>
            ))}
        </div>
        
        <button 
          onClick={() => onSelect(agent)}
          className="w-full mt-4 py-2 px-4 bg-surfaceHighlight hover:bg-primary hover:text-black text-textMain rounded-lg font-medium transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-black"
        >
          <Play size={16} fill="currentColor" />
          Spawn Agent
        </button>
      </div>
    </div>
  );
};
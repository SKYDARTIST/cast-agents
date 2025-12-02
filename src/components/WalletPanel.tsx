import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { WalletState } from '../types';
import { Wallet, LogOut, TrendingUp, TrendingDown } from 'lucide-react';

interface WalletPanelProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

// Monochrome shades for the chart
const COLORS = ['#ffffff', '#a3a3a3', '#525252', '#262626'];

export const WalletPanel: React.FC<WalletPanelProps> = ({ wallet, onConnect, onDisconnect }) => {
  if (!wallet.isConnected) {
    return (
      <div className="h-full bg-surface flex flex-col">
        {/* Header with Connect Button (Top Right) */}
        <div className="p-4 border-b border-surfaceHighlight flex justify-end">
             <button
              onClick={onConnect}
              className="py-1.5 px-3 bg-primary text-black text-xs font-bold rounded hover:bg-primaryHover transition-colors shadow-lg shadow-white/5"
            >
              Connect Wallet
            </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-surfaceHighlight rounded-full flex items-center justify-center text-primary">
            <Wallet size={32} />
            </div>
            <h3 className="text-xl font-bold text-textMain">Connect Wallet</h3>
            <p className="text-textMuted text-sm">
            Connect your wallet to let agents analyze your onchain data and propose transactions.
            </p>
        </div>
      </div>
    );
  }

  const data = wallet.tokens.map(t => ({
    name: t.symbol,
    value: t.valueUsd
  }));

  return (
    <div className="h-full bg-surface flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-surfaceHighlight flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-sm font-mono text-textMuted">{wallet.address}</span>
        </div>
        <button onClick={onDisconnect} className="text-textMuted hover:text-white transition-colors">
          <LogOut size={16} />
        </button>
      </div>

      {/* Total Balance */}
      <div className="p-6 text-center">
        <p className="text-textMuted text-sm mb-1">Total Net Worth</p>
        <h2 className="text-3xl font-bold text-textMain">
          ${wallet.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <div className="flex items-center justify-center gap-1 mt-2 text-textMain text-sm">
          <TrendingUp size={14} />
          <span>+2.4% (24h)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', color: '#ffffff' }}
              itemStyle={{ color: '#ffffff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text Trick */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-bold text-textMuted opacity-50">ASSETS</span>
        </div>
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {wallet.tokens.map((token) => (
          <div key={token.symbol} className="flex justify-between items-center p-3 bg-background rounded-lg border border-surfaceHighlight/50 hover:border-surfaceHighlight transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surfaceHighlight flex items-center justify-center text-xs font-bold text-textMain">
                {token.symbol[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-textMain">{token.symbol}</p>
                <p className="text-xs text-textMuted">{token.balance.toFixed(4)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm text-textMain">${token.valueUsd.toFixed(2)}</p>
              <div className={`flex items-center justify-end gap-0.5 text-xs ${token.change24h >= 0 ? 'text-textMain' : 'text-textMuted'}`}>
                {token.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{Math.abs(token.change24h)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
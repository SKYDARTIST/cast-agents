import React, { useState, useEffect } from 'react';
import { AgentConfig, AgentType, Message, MessageRole, WalletState } from './types';
import { AGENT_REGISTRY, MOCK_WALLET_TOKENS, MOCK_ADDRESS } from './constants';
import { AgentCard } from './components/AgentCard';
import { ChatInterface } from './components/ChatInterface';
import { WalletPanel } from './components/WalletPanel';
import { generateAgentResponse } from './services/geminiService';
import { LayoutGrid, Plus, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<AgentConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    tokens: [],
    totalValueUsd: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial Wallet Calculations
  const connectWallet = () => {
    // Simulate connection delay
    setTimeout(() => {
      const totalValue = MOCK_WALLET_TOKENS.reduce((acc, t) => acc + t.valueUsd, 0);
      setWallet({
        isConnected: true,
        address: MOCK_ADDRESS,
        tokens: MOCK_WALLET_TOKENS,
        totalValueUsd: totalValue
      });
    }, 800);
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      tokens: [],
      totalValueUsd: 0
    });
  };

  const handleAgentSelect = (agent: AgentConfig) => {
    setActiveAgent(agent);
    setMessages([]); // Clear chat for new session
  };

  const handleSendMessage = async (text: string) => {
    if (!activeAgent) return;

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: text,
      timestamp: Date.now()
    };
    
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsProcessing(true);

    // Call Gemini
    const response = await generateAgentResponse(
      updatedHistory, 
      text, 
      activeAgent, 
      wallet
    );

    setIsProcessing(false);

    // Add Model Message
    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: MessageRole.MODEL,
      content: response.text,
      timestamp: Date.now(),
      txProposal: response.proposal
    };

    setMessages(prev => [...prev, modelMsg]);
  };

  return (
    <div className="flex h-screen w-full bg-background text-textMain font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-16 md:w-20 bg-surface border-r border-surfaceHighlight flex flex-col items-center py-6 gap-6 z-20 shrink-0">
        <div className="w-10 h-10 bg-white/10 text-white border border-white/20 rounded-xl flex items-center justify-center">
            <Zap size={24} fill="currentColor" />
        </div>
        
        <div className="flex-1 flex flex-col gap-4 w-full items-center">
             <button 
                onClick={() => setActiveAgent(null)}
                className={`p-3 rounded-xl transition-all ${!activeAgent ? 'bg-primary text-black shadow-lg shadow-white/25' : 'text-textMuted hover:bg-surfaceHighlight hover:text-textMain'}`}
                title="Gallery"
             >
                <LayoutGrid size={22} />
             </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* Mobile Connect Button (Top Right) - Hidden on Desktop as Sidebar handles it */}
        {!activeAgent && (
          <div className="absolute top-4 right-4 z-50 lg:hidden">
            {!wallet.isConnected ? (
               <button 
                 onClick={connectWallet}
                 className="bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-white/10 hover:bg-primaryHover transition-colors"
               >
                 Connect Wallet
               </button>
            ) : (
                <div className="bg-surfaceHighlight px-3 py-2 rounded-lg text-xs font-mono border border-white/10">
                   {wallet.address}
                </div>
            )}
          </div>
        )}

        {!activeAgent ? (
            // Gallery View with Footer
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-5xl mx-auto">
                        <header className="mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Agent Gallery</h1>
                            <p className="text-textMuted text-lg max-w-2xl">
                                Deploy specialized autonomous agents to manage your onchain identity, execute swaps, and analyze governance proposals.
                            </p>
                        </header>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.values(AGENT_REGISTRY).map(agent => (
                                <AgentCard 
                                    key={agent.id} 
                                    agent={agent} 
                                    onSelect={handleAgentSelect} 
                                />
                            ))}
                            {/* 'Coming Soon' Placeholder */}
                            <div className="border border-dashed border-surfaceHighlight rounded-xl p-5 flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity cursor-not-allowed">
                                <div className="w-12 h-12 rounded-lg bg-surfaceHighlight mb-4 flex items-center justify-center text-textMuted">
                                    <Plus size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-textMain">Custom Agent</h3>
                                <p className="text-xs text-textMuted mt-1">Build your own (Coming Soon)</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 text-center text-xs text-textMuted border-t border-surfaceHighlight bg-surface/50 backdrop-blur-sm uppercase tracking-wider">
                    DEVELOPED BY CRYPTOBULLA
                </div>
            </div>
        ) : (
            // Active Agent View
            <ChatInterface 
                agent={activeAgent}
                messages={messages}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
                onBack={() => setActiveAgent(null)}
            />
        )}
      </div>

      {/* Wallet Panel (Right Sidebar) - Desktop Only */}
      <div className="hidden lg:block w-80 h-full border-l border-surfaceHighlight">
        <WalletPanel 
            wallet={wallet} 
            onConnect={connectWallet} 
            onDisconnect={disconnectWallet} 
        />
      </div>
    </div>
  );
};

export default App;
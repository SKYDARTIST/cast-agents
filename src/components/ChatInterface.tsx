import React, { useState, useEffect, useRef } from 'react';
import { Message, MessageRole, AgentConfig } from '../types';
import { Send, Cpu, ArrowRight, Loader2, PlayCircle, Layers, ExternalLink } from 'lucide-react';

interface ChatInterfaceProps {
  agent: AgentConfig;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  agent, 
  messages, 
  onSendMessage, 
  isProcessing,
  onBack
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-surfaceHighlight bg-surface/80 backdrop-blur-md flex items-center gap-4 z-10 sticky top-0">
            <button onClick={onBack} className="text-textMuted hover:text-textMain text-sm flex items-center gap-1">
                <ArrowRight className="rotate-180" size={14} /> Back
            </button>
            <div className="h-6 w-[1px] bg-surfaceHighlight mx-2" />
            <div className="flex items-center gap-2">
                <span className="font-bold text-textMain">{agent.name}</span>
                <span className="text-xs text-textMain flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Online
                </span>
            </div>
        </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-textMuted space-y-4 opacity-50">
            <Cpu size={48} />
            <p>Initialize {agent.name} by sending a command.</p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {agent.starterPrompts.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => onSendMessage(prompt)}
                  className="text-xs py-2 px-3 border border-surfaceHighlight rounded-lg hover:bg-surfaceHighlight hover:text-textMain transition-colors text-left"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === MessageRole.USER 
                  ? 'bg-primary text-black rounded-br-none font-medium' 
                  : 'bg-surface text-textMain border border-surfaceHighlight rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              
              {/* Transaction Proposal Card */}
              {msg.txProposal && (
                <div className="mt-4 bg-background rounded-lg overflow-hidden border border-surfaceHighlight">
                  <div className="bg-surfaceHighlight/30 p-3 flex justify-between items-center border-b border-surfaceHighlight">
                    <span className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1">
                        {msg.txProposal.type} PROPOSAL
                    </span>
                    {msg.txProposal.protocol === 'Relay.link' && (
                       <span className="text-[10px] bg-white/10 text-white border border-white/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                         <Layers size={10} /> Powered by Relay
                       </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded text-white shrink-0 border border-white/10">
                            <PlayCircle size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-textMain">{msg.txProposal.summary}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-textMuted">
                                <span>Network Cost: ~${msg.txProposal.feeUsd.toFixed(2)}</span>
                                <span>Est. Gas: {msg.txProposal.estimatedGas}</span>
                            </div>
                        </div>
                    </div>

                    {/* Steps Rendering */}
                    {msg.txProposal.steps && msg.txProposal.steps.length > 0 && (
                      <div className="mb-4 pl-3 border-l border-surfaceHighlight space-y-2">
                        {msg.txProposal.steps.map((step, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-textMain font-medium">{idx + 1}. {step.label}</span>
                            {step.description && <span className="text-textMuted ml-1">- {step.description}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button className="w-full py-2 bg-primary hover:bg-primaryHover text-black text-sm font-bold rounded transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-white/5">
                        Sign Transaction 
                        {msg.txProposal.protocol === 'Relay.link' ? <ExternalLink size={14} /> : <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                    </button>
                    {msg.txProposal.protocol === 'Relay.link' ? (
                        <p className="text-[10px] text-center text-textMuted mt-2">
                            Transaction will be executed securely via Relay.link protocol.
                        </p>
                    ) : (
                        <p className="text-[10px] text-center text-textMuted mt-2">
                            Simulated Env: This will not actually execute on-chain.
                        </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-surface border border-surfaceHighlight rounded-2xl rounded-bl-none p-4 flex items-center gap-2 text-textMuted">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Agent is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-surfaceHighlight">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${agent.name}...`}
            disabled={isProcessing}
            className="flex-1 bg-background border border-surfaceHighlight text-textMain text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-textMuted disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="p-3 bg-primary hover:bg-primaryHover disabled:bg-surfaceHighlight disabled:text-textMuted text-black rounded-xl transition-colors shadow-lg shadow-white/10 disabled:shadow-none"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
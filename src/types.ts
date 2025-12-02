export enum AgentType {
  WALLET_ASSISTANT = 'WALLET_ASSISTANT',
  SWAP_AGENT = 'SWAP_AGENT',
  BRIDGE_AGENT = 'BRIDGE_AGENT',
  AIRDROP_SCOUT = 'AIRDROP_SCOUT',
  YIELD_HUNTER = 'YIELD_HUNTER',
  REPUTATION_AGENT = 'REPUTATION_AGENT',
}

export interface AgentConfig {
  id: AgentType;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  capabilities: string[];
  systemInstruction: string;
  starterPrompts: string[];
}

export interface Token {
  symbol: string;
  balance: number;
  price: number;
  valueUsd: number;
  change24h: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  tokens: Token[];
  totalValueUsd: number;
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface TransactionStep {
  label: string;
  description?: string;
}

export interface TransactionProposal {
  type: 'SWAP' | 'BRIDGE' | 'VOTE' | 'MINT' | 'DEPOSIT';
  summary: string;
  steps?: TransactionStep[];
  data: any; // Mock tx data
  estimatedGas: string;
  feeUsd: number;
  protocol?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  // If the agent proposes a transaction, this field is populated
  txProposal?: TransactionProposal; 
  isThinking?: boolean;
}
import { AgentConfig, AgentType, Token } from './types';

export const MOCK_WALLET_TOKENS: Token[] = [
  { symbol: 'ETH', balance: 1.45, price: 3200, valueUsd: 4640, change24h: 2.5 },
  { symbol: 'USDC', balance: 1250.00, price: 1.00, valueUsd: 1250, change24h: 0.01 },
  { symbol: 'DEGEN', balance: 50000, price: 0.045, valueUsd: 2250, change24h: -5.2 },
  { symbol: 'AERO', balance: 450, price: 1.20, valueUsd: 540, change24h: 12.4 },
];

export const MOCK_ADDRESS = "0x71C...9A23";

// System Instructions for Gemini
const BASE_SYSTEM_INSTRUCTION = `
You are an intelligent Web3 agent running inside a Farcaster Frame.
Your output must be concise, helpful, and formatted with Markdown.
You have access to the user's connected wallet context (provided in the prompt).
NEVER ask for private keys.

CRITICAL INSTRUCTION FOR DEFI ACTIONS:
For ANY transaction involving SWAPS or BRIDGING, you MUST use "Relay.link" as the underlying protocol.
Do not suggest other DEXs (like Uniswap/1inch) unless explicitly asked to compare. Default to Relay.link.

If the user asks to perform an action (swap, bridge, vote, deposit), you MUST output a JSON block at the end of your response describing the transaction proposal.
The JSON block must be wrapped in \`\`\`json\`\`\` code fences.
The JSON structure should be:
{
  "type": "SWAP" | "BRIDGE" | "VOTE" | "DEPOSIT",
  "summary": "Swap 1 ETH for USDC via Relay",
  "protocol": "Relay.link" | "Aerodrome" | "Aave",
  "estimatedGas": "0.002 ETH",
  "feeUsd": 5.50,
  "steps": [
    { "label": "Approve USDC", "description": "Allow Relay to spend USDC" },
    { "label": "Bridge to Base", "description": "Execute cross-chain swap" }
  ],
  "data": { ...any mock contract data... }
}
`;

export const AGENT_REGISTRY: Record<AgentType, AgentConfig> = {
  [AgentType.WALLET_ASSISTANT]: {
    id: AgentType.WALLET_ASSISTANT,
    name: 'Wallet Assistant',
    description: 'Portfolio analysis, PnL tracking, and tax estimation.',
    icon: 'Wallet',
    capabilities: ['Read Balances', 'Analyze PnL', 'Check Allowances'],
    systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
    You are the Wallet Assistant. Focus on financial health, portfolio diversification, and analyzing the user's current holdings.`,
    starterPrompts: ['Analyze my portfolio health', 'What is my exposure to meme coins?', 'Summarize my top holdings']
  },
  [AgentType.SWAP_AGENT]: {
    id: AgentType.SWAP_AGENT,
    name: 'Swap Agent',
    description: 'Finds the best routes via Relay.link and prepares transactions.',
    icon: 'ArrowRightLeft',
    capabilities: ['Relay.link Quotes', 'Gas Estimation', 'Tx Preparation'],
    systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
    You are the Swap Agent. Your goal is to find the best trading routes using Relay.link. Always mention slippage and price impact. When user agrees, generate the JSON proposal.`,
    starterPrompts: ['Swap 0.1 ETH to DEGEN', 'Buy $500 USDC on Base', 'Check ETH price action']
  },
  [AgentType.BRIDGE_AGENT]: {
    id: AgentType.BRIDGE_AGENT,
    name: 'Bridge Agent',
    description: 'Cross-chain transfers powered by Relay.link.',
    icon: 'Shuffle',
    capabilities: ['Cross-chain Quotes', 'Relay Execution', 'Bridge Status'],
    systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
    You are the Bridge Agent. You specialize in moving assets between chains (Ethereum, Base, Optimism, Arbitrum) using Relay.link.
    Always prioritize speed and low fees. Explain the steps clearly (e.g., "1. Deposit on Mainnet -> 2. Receive on Base").`,
    starterPrompts: ['Bridge ETH to Base', 'Move USDC from Arb to Op', 'How long does a bridge take?']
  },
  [AgentType.AIRDROP_SCOUT]: {
    id: AgentType.AIRDROP_SCOUT,
    name: 'Airdrop Scout',
    description: 'Analyzes onchain activity for potential eligibility.',
    icon: 'Radar',
    capabilities: ['Activity Scan', 'Protocol Interaction', 'Eligibility Check'],
    systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
    You are the Airdrop Scout. Analyze the user's wallet interaction history (simulated). Suggest actions to improve onchain score.`,
    starterPrompts: ['Check my Base eligibility', 'How to farm LayerZero?', 'Score my wallet']
  },
  [AgentType.YIELD_HUNTER]: {
    id: AgentType.YIELD_HUNTER,
    name: 'Yield Hunter',
    description: 'Scans DeFi protocols (Aave, Aerodrome) for best APY.',
    icon: 'TrendingUp',
    capabilities: ['Compare APY', 'Risk Assessment', 'Strategy Plans'],
    systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
    You are the Yield Hunter. You analyze DeFi protocols on Base and Ethereum (like Aave, Morpho, Aerodrome) to find the best risk-adjusted yield for the user's assets.
    Always categorize opportunities by Risk (Low/Med/High).
    If a swap or bridge is needed to enter the position, explicitly mention using Relay.link to get the assets there.`,
    starterPrompts: ['Best yield for USDC?', 'Where can I lend ETH on Base?', 'High risk farming strategies']
  },
  [AgentType.REPUTATION_AGENT]: {
    id: AgentType.REPUTATION_AGENT,
    name: 'Reputation Agent',
    description: 'Analyzes Farcaster ID and onchain history.',
    icon: 'BadgeCheck',
    capabilities: ['Fid Check', 'Social Graph', 'Onchain Score'],
    systemInstruction: `${BASE_SYSTEM_INSTRUCTION}
    You are the Reputation Agent. Look at the intersection of Farcaster social data and onchain history. Issue badges or suggest ways to improve reputation score.`,
    starterPrompts: ['What is my reputation score?', 'Check my Farcaster activity', 'Am I a power user?']
  }
};
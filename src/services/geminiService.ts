import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, AgentConfig, WalletState, TransactionProposal } from "../types";

// NOTE: In a real app, this key should be proxied via backend or user-selected.
// Using process.env.API_KEY as per instructions.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateAgentResponse = async (
  history: Message[],
  currentPrompt: string,
  agent: AgentConfig,
  wallet: WalletState
): Promise<{ text: string; proposal?: TransactionProposal }> => {
  
  if (!apiKey) {
    return { text: "Error: API Key not found in environment. Please check setup." };
  }

  try {
    // Construct context about the wallet to inject into the system prompt
    const walletContext = wallet.isConnected 
      ? `User Wallet Context:\nAddress: ${wallet.address}\nTokens: ${wallet.tokens.map(t => `${t.balance} ${t.symbol} ($${t.valueUsd.toFixed(2)})`).join(', ')}\nTotal Value: $${wallet.totalValueUsd.toFixed(2)}`
      : 'User Wallet is NOT connected. Ask them to connect wallet for personalized advice.';

    const systemInstruction = `${agent.systemInstruction}\n\n${walletContext}`;

    // Map history to Gemini format (simplification for this demo)
    // In a full app, we would map role 'user' -> 'user' and 'model' -> 'model'
    let fullPrompt = `Previous conversation:\n`;
    history.forEach(msg => {
      fullPrompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });
    fullPrompt += `\nUSER: ${currentPrompt}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const rawText = response.text || "I couldn't generate a response.";
    
    // Parse for JSON proposal blocks
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    let proposal: TransactionProposal | undefined;
    let finalText = rawText;

    if (jsonMatch && jsonMatch[1]) {
      try {
        proposal = JSON.parse(jsonMatch[1]);
        // Remove the JSON block from the display text to keep UI clean
        finalText = rawText.replace(/```json[\s\S]*?```/, '').trim();
      } catch (e) {
        console.error("Failed to parse agent JSON proposal", e);
      }
    }

    return { text: finalText, proposal };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I encountered an error connecting to the intelligence network. Please try again." };
  }
};

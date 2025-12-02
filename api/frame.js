export default async function handler(req, res) {
  // Allow simple CORS for testing (tighten in production)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const send = (obj) => res.status(200).json(obj);
  const baseUrl = process.env.PROD_ROOT || `https://${req.headers.host}`;

  const initial = {
    version: 1,
    title: "CastAgents — Agent Gallery",
    subtitle: "Spawn specialized agents to check balances, scout airdrops, or prepare swaps.",
    image: `${baseUrl}/frame-gallery.png`,
    buttons: [
      { id: "wallet", label: "Wallet Assistant", style: "primary", description: "Check balances & PnL" },
      { id: "airdrop", label: "Airdrop Scout", style: "secondary", description: "Scan for airdrop eligibility" }
    ],
    post_url: `${baseUrl}/api/frame`
  };

  if (req.method === 'POST') {
    let body = {};
    try {
      body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    } catch (e) {
      body = {};
    }

    const untrusted = body.untrustedData || body.untrustedRequest || {};
    const buttonIndex = Number(untrusted.buttonIndex ?? -1);
    const selectedId = untrusted.selectedId || untrusted.id || null;

    let chosen = null;
    if (selectedId) chosen = selectedId;
    else if (buttonIndex >= 0 && initial.buttons[buttonIndex]) chosen = initial.buttons[buttonIndex].id;

    if (!chosen) return send({ ...initial, error: "No valid choice received. Please pick an option." });

    if (chosen === 'wallet') {
      return send({
        version: 1,
        title: "Wallet Assistant — Preview",
        subtitle: "This agent reads balances & suggests PnL checks.",
        image: `${baseUrl}/frame-wallet.png`,
        body: [
          "• Reads token balances (read-only).",
          "• Suggests PnL & tax notes.",
          "• Requires wallet connect to prepare transactions."
        ],
        buttons: [
          { id: "wallet:open", label: "Open Agent", style: "primary" },
          { id: "wallet:more", label: "More details", style: "secondary" }
        ],
        post_url: `${baseUrl}/api/frame`
      });
    }

    if (chosen === 'airdrop') {
      return send({
        version: 1,
        title: "Airdrop Scout — Quick Scan",
        subtitle: "A fast check of onchain actions & Farcaster activity for airdrop signals.",
        image: `${baseUrl}/frame-airdrop.png`,
        body: [
          "• Scores your wallet 0-100 for airdrop potential.",
          "• Suggests top 3 actions to improve score.",
          "• No keys required — read-only analytics."
        ],
        buttons: [
          { id: "airdrop:scan", label: "Run Scan", style: "primary" },
          { id: "airdrop:details", label: "Explain scoring", style: "secondary" }
        ],
        post_url: `${baseUrl}/api/frame`
      });
    }

    if (typeof chosen === 'string' && chosen.includes(':')) {
      return send({
        version: 1,
        title: "Agent action queued",
        subtitle: `You chose: ${chosen}`,
        body: [`This action will open the mini-agent experience on ${baseUrl}.`],
        buttons: [
          { id: "open-web", label: "Open full app", style: "primary", url: `${baseUrl}` },
          { id: "close", label: "Close", style: "secondary" }
        ]
      });
    }

    return send({ ...initial, note: `Unhandled choice: ${chosen}` });
  }

  return send(initial);
}

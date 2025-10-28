# The Dexter — Privacy-Preserving DEX (Frontend)

The Dexter is a privacy-first DEX UI scaffold built with React. It includes encrypted-themed swap and liquidity flows, portfolio, analytics, history, limit orders, a settings modal, and a create-pool interface.

## Files
- `zama-dex-frontend.tsx` — main UI component

## Setup
1) Drop the component into your React app (e.g., replace `src/App.tsx`).
2) Install UI deps:
```bash
npm install lucide-react recharts
```
3) Ensure your styling system (e.g., TailwindCSS) is configured.

## Optional fresh project (Vite + React + TS)
```bash
npm create vite@latest the-dexter -- --template react-ts
cd the-dexter
npm install
npm install lucide-react recharts
```
Replace `src/App.tsx` with the contents of `zama-dex-frontend.tsx`.

## Zama FHEVM integration (next steps)
- Replace the mock FHE helpers with the official SDK/plugin utilities.
- Compile/deploy your contracts and export ABI + addresses.
- Wire real encrypt/decrypt and contract calls from the UI.
- Docs: https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat

## Env (when using live contracts)
- `VITE_RPC_URL`
- `VITE_CHAIN_ID`
- `VITE_DEX_CONTRACT`

## Features
- Swap (Market/Limit) with slippage/deadline settings
- Liquidity add + Create Pool modal
- Portfolio with encrypted balance visuals
- Analytics with KPIs and price chart (Recharts)
- History with filtering and export button

## License
MIT

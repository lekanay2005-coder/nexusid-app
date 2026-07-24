# NexusID App Layer

`nexusid-app` is the full-stack application layer for NexusID, communicating with Soroban smart contracts (`identity-registry`, `wallet-link`, `reputation-score`) on Stellar Testnet.

## Tech Stack

- **TypeScript** (Strict mode)
- **Next.js** (App Router) for `apps/web`
- **@stellar/stellar-sdk** & `@stellar/freighter-api`
- **Node.js + Express** Indexer with **Prisma** & **PostgreSQL**
- **npm Workspaces** Monorepo

---

## Environment Variables

| Variable | Used by | Value source |
|---|---|---|
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | web, sdk | Testnet Soroban RPC endpoint |
| `NEXT_PUBLIC_NETWORK_PASSPHRASE` | web, sdk | `"Test SDF Network ; September 2015"` for testnet |
| `NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID` | web, sdk | filled after Phase 8 deploy |
| `NEXT_PUBLIC_WALLET_LINK_CONTRACT_ID` | web, sdk | filled after Phase 8 deploy |
| `NEXT_PUBLIC_REPUTATION_SCORE_CONTRACT_ID` | web, sdk | filled after Phase 8 deploy |
| `NEXT_PUBLIC_SIMULATION_ACCOUNT` | web, sdk | any funded testnet public key used only for read simulations |
| `DATABASE_URL` | indexer | Postgres connection string |
| `INDEXER_PORT` | indexer | e.g. `4000` |
| `NEXT_PUBLIC_INDEXER_URL` | web | base URL the frontend proxies to |

---

## Local Setup & Development

1. Install dependencies across workspace:
   ```bash
   npm install
   ```

2. Build the SDK:
   ```bash
   npm run build:sdk
   ```

3. Run typecheck:
   ```bash
   npm run typecheck
   ```

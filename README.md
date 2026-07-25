# NexusID

Decentralized identity protocol on Stellar — create on-chain profiles, link cross-chain wallets (Solana, Ethereum, Base), and build verifiable reputation.

---

## Architecture

```
User → Freighter Wallet → Next.js Frontend
                              ├── Soroban RPC (writes: create profile, link wallet, attest)
                              └── Indexer API (reads: cached profiles, reputation)
                                      └── PostgreSQL
```

| Layer | Stack | Directory |
|---|---|---|
| Smart Contracts | Rust + Soroban SDK 27 | `contracts/` |
| SDK | TypeScript, stellar-sdk, freighter-api | `packages/sdk/` |
| Web App | Next.js 14, React 18, Tailwind | `apps/web/` |
| Indexer | Express, Prisma, PostgreSQL | `indexer/` |

## Contracts

| Contract | Role |
|---|---|
| `identity-registry` | Create & manage on-chain profiles (metadata URI, created ledger) |
| `wallet-link` | Link external wallets (Solana, Ethereum, Base) with signature verification |
| `reputation-score` | Record attestations, compute aggregate reputation scores |

## Quick Start

```bash
npm install
npm run build:sdk
npm run typecheck
```

Copy `.env.example` to `.env.local` and fill in contract IDs after deployment:

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID=<deploy-output>
NEXT_PUBLIC_WALLET_LINK_CONTRACT_ID=<deploy-output>
NEXT_PUBLIC_REPUTATION_SCORE_CONTRACT_ID=<deploy-output>
NEXT_PUBLIC_SIMULATION_ACCOUNT=<any-funded-testnet-key>
NEXT_PUBLIC_INDEXER_URL=http://localhost:4000
DATABASE_URL=postgresql://localhost:5432/nexusid
INDEXER_PORT=4000
```

## Deploy Contracts

Requires [stellar-cli](https://github.com/stellar/stellar-cli):

```bash
cd contracts
make deploy-all
```

## Run

```bash
# Frontend
npm run build:web && npm run start --workspace=apps/web

# Indexer
cd indexer && npx prisma migrate dev && npm run dev
```

# NexusID Documentation

NexusID is a decentralized identity protocol built on Stellar. It enables users to create on-chain profiles, link wallets across chains (Solana, Ethereum, Base), and build verifiable reputation through attestations.

## Why NexusID?

Existing on-chain identity is fragmented — your Stellar account has no connection to your Ethereum address or Solana wallet. NexusID bridges this gap with a unified identity layer powered by Soroban smart contracts.

## Architecture

```
User Wallet (Freighter) → Next.js Frontend → Soroban RPC (writes)
                                         → Indexer API (reads) → PostgreSQL
```

### Smart Contracts

| Contract | Purpose |
|---|---|
| identity-registry | Create and manage on-chain identity profiles |
| wallet-link | Link external wallets with cryptographic verification |
| reputation-score | Record attestations and compute reputation scores |

### App Layer

| Component | Stack | Role |
|---|---|---|
| SDK | TypeScript, stellar-sdk | Contract interaction library |
| Web App | Next.js 14, React 18 | User-facing dashboard |
| Indexer | Express, Prisma | Event listener + cached API |

## Guides

- [User Guide: Creating a Profile](/docs/guides/creating-a-profile.md)
- [User Guide: Linking Wallets](/docs/guides/linking-wallets.md)
- [User Guide: Reputation](/docs/guides/reputation.md)

## Developer Docs

- [Setup Guide](/docs/developers/setup.md)
- [SDK Reference](/docs/developers/sdk.md)
- [API Reference](/docs/developers/api.md)

## Smart Contracts

- [identity-registry](/docs/contracts/identity-registry.md)
- [wallet-link](/docs/contracts/wallet-link.md)
- [reputation-score](/docs/contracts/reputation-score.md)

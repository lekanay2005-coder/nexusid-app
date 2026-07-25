# Contributing to NexusID

## Getting Started

```bash
npm install
npm run build:sdk
npm run typecheck
```

## Project Structure

```
contracts/          # Soroban smart contracts (Rust)
packages/sdk/       # TypeScript SDK for contract interaction
apps/web/           # Next.js frontend
indexer/            # Express + Prisma backend
docs/               # Documentation site
```

## Making Changes

1. Create a branch: `git checkout -b feat/your-feature`
2. Make changes and commit conventionally: `feat:`, `fix:`, `chore:`, `docs:`
3. Run typecheck: `npm run typecheck`
4. Run lint: `npm run lint`
5. Push and open a PR

## Commit Convention

```
feat(scope): message    # new feature
fix(scope): message     # bug fix
chore(scope): message   # maintenance
docs(scope): message    # documentation
```

## Contracts

- Rust workspace under `contracts/`
- Build: `cd contracts && cargo build --target wasm32v1-none --release`
- Test: `cd contracts && cargo test`
- Deploy: `make deploy-all` (requires stellar CLI)

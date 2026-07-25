# Developer Setup

## Prerequisites

- Node.js 20+
- Rust 1.84+ (with `wasm32v1-none` target)
- stellar-cli
- PostgreSQL 16+

## Install Dependencies

```bash
git clone https://github.com/lekanay2005-coder/nexusid-app.git
cd nexusid-app
npm install
```

## Build SDK

```bash
npm run build:sdk
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

See the [Environment Reference](/docs/developers/environment.md) for all variables.

## Run Typecheck

```bash
npm run typecheck
```

## Build Contracts

```bash
cd contracts
cargo build --target wasm32v1-none --release
```

## Run Tests

```bash
# Contracts
cd contracts && cargo test

# App
npm run typecheck
```

## Run Indexer

```bash
cd indexer
npx prisma migrate dev
npm run dev
```

## Run Frontend

```bash
npm run build:web
npm start --workspace=apps/web
```

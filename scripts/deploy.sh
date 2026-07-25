#!/usr/bin/env bash
set -euo pipefail

NETWORK=${1:-testnet}
SOROBAN="stellar"

echo "=== Building contracts ==="
cd "$(dirname "$0")/../contracts"

cargo build --target wasm32v1-none --release

echo "=== Deploying identity-registry ==="
IDENTITY_ID=$($SOROBAN contract deploy \
  --wasm target/wasm32v1-none/release/identity_registry.wasm \
  --network "$NETWORK")
echo "identity-registry: $IDENTITY_ID"

echo "=== Deploying wallet-link ==="
WALLET_ID=$($SOROBAN contract deploy \
  --wasm target/wasm32v1-none/release/wallet_link.wasm \
  --network "$NETWORK")
echo "wallet-link: $WALLET_ID"

echo "=== Deploying reputation-score ==="
REPUTATION_ID=$($SOROBAN contract deploy \
  --wasm target/wasm32v1-none/release/reputation_score.wasm \
  --network "$NETWORK")
echo "reputation-score: $REPUTATION_ID"

echo ""
echo "=== Contract IDs ==="
echo "NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID=$IDENTITY_ID"
echo "NEXT_PUBLIC_WALLET_LINK_CONTRACT_ID=$WALLET_ID"
echo "NEXT_PUBLIC_REPUTATION_SCORE_CONTRACT_ID=$REPUTATION_ID"
echo ""
echo "Add these to .env.local and your hosting platform env vars."

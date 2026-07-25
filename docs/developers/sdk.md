# SDK Reference

The SDK (`@nexusid/sdk`) provides TypeScript bindings for all Soroban contracts.

## Installation

The SDK is an npm workspace package at `packages/sdk/`.

## Usage

### Identity Registry

```typescript
import { createProfile, getProfile, updateMetadata } from '@nexusid/sdk'

// Create profile
await createProfile(stellarAddress, 'ipfs://QmYourMetadataURI', publicKey)

// Read profile
const profile = await getProfile(stellarAddress)

// Update metadata
await updateMetadata(stellarAddress, 'ipfs://QmUpdatedURI', publicKey)
```

### Wallet Link

```typescript
import { getNonce, linkSolanaWallet, linkEvmWallet } from '@nexusid/sdk'

// Get nonce
const nonce = await getNonce(stellarAddress)

// Link Solana wallet
const { solanaPubkey, signature } = await signSolanaChallenge(stellarAddress)
await linkSolanaWallet(stellarAddress, solanaPubkey, signature, publicKey)

// Link EVM wallet
const result = await signEvmChallenge(stellarAddress, 'ethereum')
await linkEvmWallet(
  stellarAddress, result.chain, result.evmAddress,
  result.messageHash, result.signature, result.recoveryId,
  publicKey
)
```

### Reputation Score

```typescript
import { getScore, getAttestationHistory } from '@nexusid/sdk'

const score = await getScore(stellarAddress)
const history = await getAttestationHistory(stellarAddress, 20)
```

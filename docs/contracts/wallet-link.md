# wallet-link

Cross-chain wallet linking with cryptographic verification.

## Storage

- `Nonce(Address)` — replay protection counter (u64)
- `Wallet(Address)` — list of linked wallets `Vec<LinkedWallet>`

## Functions

### get_nonce(owner) -> u64
- Read-only, no auth
- Returns current nonce for challenge signing

### link_solana_wallet(owner, solana_pubkey, signature)
- Auth: `owner.require_auth()`
- Verifies Ed25519 signature of challenge `NEXUSID_LINK:{owner}:{nonce}`
- Fails with `AlreadyLinked` if same wallet is already linked
- Fails with `InvalidSignature` if signature doesn't verify
- Increments nonce after successful link
- Emits `link_solana_wallet` event

### link_evm_wallet(owner, chain, evm_address, message_hash, signature, recovery_id)
- Auth: `owner.require_auth()`
- Verifies ECDSA signature via secp256k1 recovery
- Compares recovered address (last 20 bytes of keccak256) to `evm_address`
- Same failure modes as solana linking
- Emits `link_evm_wallet` event

### get_links(owner) -> Vec<LinkedWallet>
- Read-only, no auth
- Returns all linked wallets

### remove_link(owner, chain, external_address)
- Auth: `owner.require_auth()`
- Removes a specific linked wallet
- Fails with `NotFound` if link doesn't exist
- Emits `remove_link` event

## Challenge Format

```
NEXUSID_LINK:{stellar_address}:{nonce}
```

# Linking Wallets

NexusID allows you to link external wallets (Solana, Ethereum, Base) to your Stellar identity.

## How It Works

1. You initiate a link request from your NexusID profile
2. The SDK fetches a nonce from the `wallet-link` contract
3. You sign a challenge message with your external wallet: `NEXUSID_LINK:{stellarAddress}:{nonce}`
4. The signed challenge is submitted to the `wallet-link` contract
5. The contract verifies the signature and stores the link

## Supported Chains

| Chain | Wallet | Signing Method |
|---|---|---|
| Solana | Phantom | Ed25519 `signMessage` |
| Ethereum | MetaMask | EIP-191 `personal_sign` |
| Base | MetaMask | EIP-191 `personal_sign` |

## Steps

1. Connect Freighter to NexusID
2. Navigate to **Link Wallet**
3. Select a chain (Solana, Ethereum, or Base)
4. Approve the signature request in your external wallet
5. The link is recorded on-chain

## Removing a Link

Links can be removed from your profile. This emits a `remove_link` event.

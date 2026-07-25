# Creating a Profile

## Prerequisites

- Freighter wallet installed in your browser
- Testnet XLM from the Stellar faucet

## Steps

1. Open NexusID at `https://nexusid.app`
2. Click **Connect Freighter** and approve the connection
3. Navigate to **Profile**
4. Enter a metadata URI (IPFS, Arweave) pointing to your profile data
5. Click **Create Profile**

Your profile is now stored on-chain. Anyone can view it at `/profile/{your-stellar-address}`.

## Updating Metadata

1. Go to your **Profile** page
2. Enter a new metadata URI
3. Click **Update Metadata**

Each update emits a `update_metadata` event on the Soroban contract.

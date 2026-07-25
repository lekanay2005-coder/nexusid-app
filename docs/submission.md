# Drips Wave Submission — NexusID

## Project Description

NexusID is a decentralized identity protocol on Stellar that lets users create on-chain profiles, link wallets across chains (Solana, Ethereum, Base) via cryptographic verification, and build verifiable reputation through attestations. It fills the identity gap in the Stellar ecosystem — no approved Wave project covers on-chain identity or cross-chain wallet linking.

## Live Links

- App: _(deploy to Vercel)_
- Repo: https://github.com/lekanay2005-coder/nexusid-app
- Contracts Repo: _(same repo, contracts/ directory)_
- Docs: _(docs/ directory in repo)_

## Repo Relationship

Single repository containing both Soroban contracts (`contracts/`) and the application layer (`packages/sdk/`, `apps/web/`, `indexer/`). Splits into two repos if Wave prefers: `nexusid-contracts` and `nexusid-app`.

## Planned Issues

| Issue | Type | Description |
|---|---|---|
| `feat(indexer): add rate limiting` | feature | Protect the indexer API with rate limiting |
| `feat(sdk): add Aptos chain support` | feature | Extend wallet linking to Aptos blockchain |
| `feat(web): add profile search page` | feature | Search/discover profiles by address or metadata |
| `feat(web): add attestation UI` | feature | Allow users to submit attestations from the frontend |
| `feat(indexer): add pagination` | feature | Paginate attestation and link responses |
| `chore: add e2e tests` | feature | Playwright end-to-end tests for the full flow |
| `feat: add CONTRIBUTING.md` | docs | Contribution guide (done) |

Created issues: [#1](https://github.com/lekanay2005-coder/nexusid-app/issues/1), [#2](https://github.com/lekanay2005-coder/nexusid-app/issues/2), [#3](https://github.com/lekanay2005-coder/nexusid-app/issues/3), [#4](https://github.com/lekanay2005-coder/nexusid-app/issues/4), [#5](https://github.com/lekanay2005-coder/nexusid-app/issues/5)

## Verification

Contracts are located at `contracts/` in this repo. After deployment, contract IDs will be published as release tag `v0.1.0`.

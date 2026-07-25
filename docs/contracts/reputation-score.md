# reputation-score

Verifiable reputation scoring through attestations.

## Storage

- `Attestations(Address)` — list of attestations `Vec<Attestation>`
- `Score(Address)` — computed aggregate score (i32)

## Functions

### get_score(owner) -> i32
- Read-only, no auth
- Returns current reputation score (default 0)

### get_attestation_history(owner, limit) -> Vec<Attestation>
- Read-only, no auth
- Returns the most recent `limit` attestations

### record_attestation(owner, delta, reason)
- Auth: `owner.require_auth()` (attestor signs)
- Delta must be non-zero (fails with `ZeroDelta`)
- Appends attestation to history, updates aggregate score
- Score is capped at i32 bounds via `checked_add`
- Emits `record_attestation` event

## Attestation Structure

| Field | Type | Description |
|---|---|---|
| attestor | Address | Contract address of the attester |
| delta | i32 | Score change |
| reason | String | Human-readable reason |
| ledger | u32 | Ledger sequence number |

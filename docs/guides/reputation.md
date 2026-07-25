# Reputation

NexusID's reputation system allows attestors to record verifiable claims about an identity.

## Score Calculation

The reputation score is a running sum of all attestation deltas:

```
score = sum of all delta values
```

Positive deltas increase the score; negative deltas decrease it.

## Attestations

Each attestation contains:

| Field | Type | Description |
|---|---|---|
| attestor | Address | Who made the attestation |
| delta | i32 | Score change (-100 to 100) |
| reason | String | Human-readable reason |
| ledger | u32 | Stellar ledger sequence |

## Viewing Reputation

- Your profile shows your current score and attestation history
- Public profiles at `/profile/{address}` display the same
- The score is color-coded: green for positive, red for negative

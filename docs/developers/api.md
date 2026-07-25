# API Reference

The Indexer exposes a REST API for reading cached data.

## Base URL

```
http://localhost:4000
```

## Endpoints

### GET /api/profile/:address

Returns profile with linked wallets and attestations.

**Response:**

```json
{
  "owner": "G...",
  "metadataUri": "ipfs://...",
  "createdLedger": 12345,
  "links": [
    { "chain": "solana", "externalAddress": "0x...", "ledger": 12346 }
  ],
  "attestations": [
    { "attestor": "G...", "delta": 10, "reason": "Good actor", "ledger": 12347 }
  ]
}
```

### POST /api/profile

Upsert a profile.

**Request:**

```json
{
  "owner": "G...",
  "metadataUri": "ipfs://...",
  "createdLedger": 12345
}
```

### GET /api/reputation/:address

Returns computed score and recent attestations.

**Response:**

```json
{
  "score": 42,
  "attestations": [...]
}
```

### GET /health

Health check.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "..."
}
```

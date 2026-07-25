# identity-registry

On-chain identity profile management.

## Storage

- `Profile(Address)` — maps owner address to `{ metadata_uri: String, created_ledger: u32 }`

## Functions

### create_profile(owner, metadata_uri)
- Auth: `owner.require_auth()`
- Creates a new profile
- Fails with `AlreadyExists` if profile exists
- Emits `create_profile` event

### update_metadata(owner, metadata_uri)
- Auth: `owner.require_auth()`
- Updates the metadata URI of an existing profile
- Fails with `NotFound` if no profile exists
- Emits `update_metadata` event

### get_profile(owner) -> Option<Profile>
- Read-only, no auth
- Returns the profile or `None`

## Events

- `("create_profile", owner)` with profile data
- `("update_metadata", owner)` with profile data

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype, Env, Address, String,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    AlreadyExists = 1,
    NotFound = 2,
    NotAuthorized = 3,
}

#[contracttype]
pub struct Profile {
    pub metadata_uri: String,
    pub created_ledger: u32,
}

#[contracttype]
pub enum DataKey {
    Profile(Address),
}

#[contract]
pub struct IdentityRegistry;

#[contractimpl]
impl IdentityRegistry {
    pub fn create_profile(env: Env, owner: Address, metadata_uri: String) -> Result<(), Error> {
        owner.require_auth();

        if env.storage().persistent().has(&DataKey::Profile(owner.clone())) {
            return Err(Error::AlreadyExists);
        }

        let profile = Profile {
            metadata_uri,
            created_ledger: env.ledger().sequence(),
        };

        env.storage().persistent().set(&DataKey::Profile(owner.clone()), &profile);
        env.storage().persistent().extend_ttl(&DataKey::Profile(owner.clone()), 10000, 100000);

        env.events().publish(("create_profile", owner), &profile);

        Ok(())
    }

    pub fn update_metadata(env: Env, owner: Address, metadata_uri: String) -> Result<(), Error> {
        owner.require_auth();

        let mut profile = env
            .storage()
            .persistent()
            .get::<DataKey, Profile>(&DataKey::Profile(owner.clone()))
            .ok_or(Error::NotFound)?;

        profile.metadata_uri = metadata_uri;

        env.storage().persistent().set(&DataKey::Profile(owner.clone()), &profile);
        env.storage().persistent().extend_ttl(&DataKey::Profile(owner), 10000, 100000);

        env.events().publish(("update_metadata", owner), &profile);

        Ok(())
    }

    pub fn get_profile(env: Env, owner: Address) -> Option<Profile> {
        env.storage().persistent().get::<DataKey, Profile>(&DataKey::Profile(owner))
    }
}

#[cfg(test)]
mod tests;

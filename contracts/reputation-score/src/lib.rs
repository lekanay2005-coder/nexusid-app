#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype, Env, Address, String, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    NotFound = 1,
    NotAuthorized = 2,
    ZeroDelta = 3,
}

#[contracttype]
pub struct Attestation {
    pub attestor: Address,
    pub delta: i32,
    pub reason: String,
    pub ledger: u32,
}

#[contracttype]
pub enum DataKey {
    Attestations(Address),
    Score(Address),
}

#[contract]
pub struct ReputationScore;

#[contractimpl]
impl ReputationScore {
    pub fn get_score(env: Env, owner: Address) -> i32 {
        env.storage()
            .persistent()
            .get::<DataKey, i32>(&DataKey::Score(owner))
            .unwrap_or(0)
    }

    pub fn get_attestation_history(env: Env, owner: Address, limit: u32) -> Vec<Attestation> {
        let all = env
            .storage()
            .persistent()
            .get::<DataKey, Vec<Attestation>>(&DataKey::Attestations(owner))
            .unwrap_or(Vec::new(&env));

        let start = if (all.len() as u32) > limit {
            all.len() - limit as u32
        } else {
            0
        };

        let mut result = Vec::new(&env);
        for i in start..all.len() {
            result.push_back(all.get(i).unwrap());
        }
        result
    }

    pub fn record_attestation(
        env: Env,
        attestor: Address,
        owner: Address,
        delta: i32,
        reason: String,
    ) -> Result<(), Error> {
        attestor.require_auth();

        if delta == 0 {
            return Err(Error::ZeroDelta);
        }

        let attestation = Attestation {
            attestor,
            delta,
            reason,
            ledger: env.ledger().sequence(),
        };

        let mut attestations = env
            .storage()
            .persistent()
            .get::<DataKey, Vec<Attestation>>(&DataKey::Attestations(owner.clone()))
            .unwrap_or(Vec::new(&env));

        attestations.push_back(attestation);

        let current_score = Self::get_score(env.clone(), owner.clone());
        let new_score = current_score.checked_add(delta).unwrap_or(current_score);

        env.storage().persistent().set(&DataKey::Attestations(owner.clone()), &attestations);
        env.storage().persistent().set(&DataKey::Score(owner.clone()), &new_score);
        env.storage().persistent().extend_ttl(&DataKey::Attestations(owner.clone()), 10000, 100000);
        env.storage().persistent().extend_ttl(&DataKey::Score(owner.clone()), 10000, 100000);

        env.events().publish(("record_attestation", owner), (delta, new_score));

        Ok(())
    }
}

#[cfg(test)]
mod tests;

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype, Env, Address, Bytes, String, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    AlreadyLinked = 1,
    NotFound = 2,
    NotAuthorized = 3,
    InvalidSignature = 4,
}

#[contracttype]
pub struct LinkedWallet {
    pub chain: String,
    pub external_address: Bytes,
}

#[contracttype]
pub enum DataKey {
    Nonce(Address),
    Wallet(Address),
}

#[contract]
pub struct WalletLink;

#[contractimpl]
impl WalletLink {
    pub fn get_nonce(env: Env, owner: Address) -> u64 {
        env.storage()
            .persistent()
            .get::<DataKey, u64>(&DataKey::Nonce(owner))
            .unwrap_or(0)
    }

    pub fn link_solana_wallet(
        env: Env,
        owner: Address,
        solana_pubkey: Bytes,
        signature: Bytes,
    ) -> Result<(), Error> {
        owner.require_auth();

        let wallets = Self::get_links(env.clone(), owner.clone());
        for w in wallets.iter() {
            if w.chain == String::from_str(&env, "solana")
                && w.external_address == solana_pubkey
            {
                return Err(Error::AlreadyLinked);
            }
        }

        let nonce = Self::get_nonce(env.clone(), owner.clone());
        let message = build_challenge_message(&env, &owner, nonce);
        let expected = env.crypto().ed25519_verify(&solana_pubkey, &message, &signature);
        if !expected {
            return Err(Error::InvalidSignature);
        }

        let linked = LinkedWallet {
            chain: String::from_str(&env, "solana"),
            external_address: solana_pubkey,
        };

        let mut wallets = Self::get_links(env.clone(), owner.clone());
        wallets.push_back(linked.clone());

        env.storage().persistent().set(&DataKey::Wallet(owner.clone()), &wallets);
        env.storage().persistent().set(&DataKey::Nonce(owner.clone()), &(nonce + 1));
        env.storage().persistent().extend_ttl(&DataKey::Wallet(owner.clone()), 10000, 100000);
        env.storage().persistent().extend_ttl(&DataKey::Nonce(owner.clone()), 10000, 100000);

        env.events().publish(("link_solana_wallet", owner), &linked);

        Ok(())
    }

    pub fn link_evm_wallet(
        env: Env,
        owner: Address,
        chain: String,
        evm_address: Bytes,
        message_hash: Bytes,
        signature: Bytes,
        recovery_id: u32,
    ) -> Result<(), Error> {
        owner.require_auth();

        let wallets = Self::get_links(env.clone(), owner.clone());
        for w in wallets.iter() {
            if w.chain == chain && w.external_address == evm_address {
                return Err(Error::AlreadyLinked);
            }
        }

        let nonce = Self::get_nonce(env.clone(), owner.clone());
        let message = build_challenge_message(&env, &owner, nonce);

        let recovered = env.crypto().secp256k1_recover(&message_hash, &signature, recovery_id);
        let recovered_addr = env.crypto().keccak256(&recovered).slice(12..);

        if recovered_addr != evm_address {
            return Err(Error::InvalidSignature);
        }

        let linked = LinkedWallet {
            chain,
            external_address: evm_address,
        };

        let mut wallets = Self::get_links(env.clone(), owner.clone());
        wallets.push_back(linked.clone());

        env.storage().persistent().set(&DataKey::Wallet(owner.clone()), &wallets);
        env.storage().persistent().set(&DataKey::Nonce(owner.clone()), &(nonce + 1));
        env.storage().persistent().extend_ttl(&DataKey::Wallet(owner.clone()), 10000, 100000);
        env.storage().persistent().extend_ttl(&DataKey::Nonce(owner), 10000, 100000);

        env.events().publish(("link_evm_wallet", owner), &linked);

        Ok(())
    }

    pub fn get_links(env: Env, owner: Address) -> Vec<LinkedWallet> {
        env.storage()
            .persistent()
            .get::<DataKey, Vec<LinkedWallet>>(&DataKey::Wallet(owner))
            .unwrap_or(Vec::new(&env))
    }

    pub fn remove_link(
        env: Env,
        owner: Address,
        chain: String,
        external_address: Bytes,
    ) -> Result<(), Error> {
        owner.require_auth();

        let wallets = Self::get_links(env.clone(), owner.clone());

        let filtered: Vec<LinkedWallet> = wallets
            .iter()
            .filter(|w| !(w.chain == chain && w.external_address == external_address))
            .collect();

        if filtered.len() == wallets.len() {
            return Err(Error::NotFound);
        }

        env.storage().persistent().set(&DataKey::Wallet(owner.clone()), &filtered);
        env.storage().persistent().extend_ttl(&DataKey::Wallet(owner), 10000, 100000);

        env.events().publish(("remove_link", owner), (chain, external_address));

        Ok(())
    }
}

fn build_challenge_message(env: &Env, owner: &Address, nonce: u64) -> Bytes {
    let mut msg = Bytes::new(env);
    msg.append(&Bytes::from_slice(env, b"NEXUSID_LINK:"));
    msg.append(&owner.to_string().into_bytes());
    msg.append(&Bytes::from_slice(env, b":"));
    let nonce_bytes = nonce.to_be_bytes();
    msg.append(&Bytes::from_slice(env, &nonce_bytes));
    msg
}

#[cfg(test)]
mod tests;

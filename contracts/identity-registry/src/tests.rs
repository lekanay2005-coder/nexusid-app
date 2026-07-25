use crate::{IdentityRegistry, IdentityRegistryClient, Error};
use soroban_sdk::{Env, String, Address};

#[test]
fn test_create_profile() {
    let env = Env::default();
    let contract_id = env.register(IdentityRegistry, ());
    let user = Address::generate(&env);
    let client = IdentityRegistryClient::new(&env, &contract_id);

    client.create_profile(&user, &String::from_str(&env, "ipfs://QmTest"));

    let profile = client.get_profile(&user).unwrap();
    assert_eq!(profile.metadata_uri, String::from_str(&env, "ipfs://QmTest"));
    assert!(profile.created_ledger > 0);
}

#[test]
fn test_create_duplicate_profile_fails() {
    let env = Env::default();
    let contract_id = env.register(IdentityRegistry, ());
    let user = Address::generate(&env);
    let client = IdentityRegistryClient::new(&env, &contract_id);

    client.create_profile(&user, &String::from_str(&env, "ipfs://QmTest"));

    let result = client.try_create_profile(&user, &String::from_str(&env, "ipfs://QmTest2"));
    assert_eq!(result.err().unwrap().unwrap(), Error::AlreadyExists);
}

#[test]
fn test_update_metadata() {
    let env = Env::default();
    let contract_id = env.register(IdentityRegistry, ());
    let user = Address::generate(&env);
    let client = IdentityRegistryClient::new(&env, &contract_id);

    client.create_profile(&user, &String::from_str(&env, "ipfs://QmTest"));
    client.update_metadata(&user, &String::from_str(&env, "ipfs://QmUpdated"));

    let profile = client.get_profile(&user).unwrap();
    assert_eq!(profile.metadata_uri, String::from_str(&env, "ipfs://QmUpdated"));
}

#[test]
fn test_update_nonexistent_profile_fails() {
    let env = Env::default();
    let contract_id = env.register(IdentityRegistry, ());
    let user = Address::generate(&env);
    let client = IdentityRegistryClient::new(&env, &contract_id);

    let result = client.try_update_metadata(&user, &String::from_str(&env, "ipfs://QmTest"));
    assert_eq!(result.err().unwrap().unwrap(), Error::NotFound);
}

#[test]
fn test_get_profile_not_found() {
    let env = Env::default();
    let contract_id = env.register(IdentityRegistry, ());
    let user = Address::generate(&env);
    let client = IdentityRegistryClient::new(&env, &contract_id);

    let profile = client.get_profile(&user);
    assert!(profile.is_none());
}

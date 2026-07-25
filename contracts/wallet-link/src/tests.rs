use crate::{WalletLink, WalletLinkClient, Error, LinkedWallet};
use soroban_sdk::{vec, Env, String, Address, Bytes, Vec};

#[test]
fn test_get_nonce_starts_at_zero() {
    let env = Env::default();
    let contract_id = env.register(WalletLink, ());
    let user = Address::generate(&env);
    let client = WalletLinkClient::new(&env, &contract_id);

    assert_eq!(client.get_nonce(&user), 0);
}

#[test]
fn test_get_links_empty() {
    let env = Env::default();
    let contract_id = env.register(WalletLink, ());
    let user = Address::generate(&env);
    let client = WalletLinkClient::new(&env, &contract_id);

    assert_eq!(client.get_links(&user).len(), 0);
}

#[test]
fn test_link_solana_wallet() {
    let env = Env::default();
    let contract_id = env.register(WalletLink, ());
    let user = Address::generate(&env);
    let client = WalletLinkClient::new(&env, &contract_id);

    let sol_pubkey = Bytes::from_slice(&env, &[0u8; 32]);
    let sig = Bytes::from_slice(&env, &[0u8; 64]);

    let result = client.try_link_solana_wallet(&user, &sol_pubkey, &sig);
    assert!(result.is_ok());

    let links = client.get_links(&user);
    assert_eq!(links.len(), 1);
    assert_eq!(links.get(0).unwrap().chain, String::from_str(&env, "solana"));
}

#[test]
fn test_link_evm_wallet() {
    let env = Env::default();
    let contract_id = env.register(WalletLink, ());
    let user = Address::generate(&env);
    let client = WalletLinkClient::new(&env, &contract_id);

    let evm_addr = Bytes::from_slice(&env, &[0u8; 20]);
    let msg_hash = Bytes::from_slice(&env, &[0u8; 32]);
    let sig = Bytes::from_slice(&env, &[0u8; 64]);
    let recovery_id: u32 = 0;

    let result = client.try_link_evm_wallet(
        &user,
        &String::from_str(&env, "ethereum"),
        &evm_addr,
        &msg_hash,
        &sig,
        &recovery_id,
    );
    assert!(result.is_ok());
}

#[test]
fn test_remove_link() {
    let env = Env::default();
    let contract_id = env.register(WalletLink, ());
    let user = Address::generate(&env);
    let client = WalletLinkClient::new(&env, &contract_id);

    let sol_pubkey = Bytes::from_slice(&env, &[0u8; 32]);
    let sig = Bytes::from_slice(&env, &[0u8; 64]);
    client.link_solana_wallet(&user, &sol_pubkey, &sig);

    assert_eq!(client.get_links(&user).len(), 1);

    client.remove_link(&user, &String::from_str(&env, "solana"), &sol_pubkey);
    assert_eq!(client.get_links(&user).len(), 0);
}

#[test]
fn test_remove_nonexistent_link_fails() {
    let env = Env::default();
    let contract_id = env.register(WalletLink, ());
    let user = Address::generate(&env);
    let client = WalletLinkClient::new(&env, &contract_id);

    let result = client.try_remove_link(
        &user,
        &String::from_str(&env, "solana"),
        &Bytes::from_slice(&env, &[0u8; 32]),
    );
    assert_eq!(result.err().unwrap().unwrap(), Error::NotFound);
}

#[test]
fn test_nonce_increments_after_link() {
    let env = Env::default();
    let contract_id = env.register(WalletLink, ());
    let user = Address::generate(&env);
    let client = WalletLinkClient::new(&env, &contract_id);

    assert_eq!(client.get_nonce(&user), 0);

    let sol_pubkey = Bytes::from_slice(&env, &[0u8; 32]);
    let sig = Bytes::from_slice(&env, &[0u8; 64]);
    client.link_solana_wallet(&user, &sol_pubkey, &sig);

    assert_eq!(client.get_nonce(&user), 1);
}

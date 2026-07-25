use crate::{ReputationScore, ReputationScoreClient, Error};
use soroban_sdk::{Env, String, Address};

#[test]
fn test_get_score_starts_at_zero() {
    let env = Env::default();
    let contract_id = env.register(ReputationScore, ());
    let user = Address::generate(&env);
    let client = ReputationScoreClient::new(&env, &contract_id);

    assert_eq!(client.get_score(&user), 0);
}

#[test]
fn test_get_attestation_history_empty() {
    let env = Env::default();
    let contract_id = env.register(ReputationScore, ());
    let user = Address::generate(&env);
    let client = ReputationScoreClient::new(&env, &contract_id);

    assert_eq!(client.get_attestation_history(&user, &10).len(), 0);
}

#[test]
fn test_record_attestation_updates_score() {
    let env = Env::default();
    let contract_id = env.register(ReputationScore, ());
    let user = Address::generate(&env);
    let client = ReputationScoreClient::new(&env, &contract_id);

    client.record_attestation(&user, &10, &String::from_str(&env, "Good actor"));
    assert_eq!(client.get_score(&user), 10);

    client.record_attestation(&user, &(-3), &String::from_str(&env, "Missed deadline"));
    assert_eq!(client.get_score(&user), 7);
}

#[test]
fn test_record_zero_delta_fails() {
    let env = Env::default();
    let contract_id = env.register(ReputationScore, ());
    let user = Address::generate(&env);
    let client = ReputationScoreClient::new(&env, &contract_id);

    let result = client.try_record_attestation(&user, &0, &String::from_str(&env, "No change"));
    assert_eq!(result.err().unwrap().unwrap(), Error::ZeroDelta);
}

#[test]
fn test_attestation_history_respects_limit() {
    let env = Env::default();
    let contract_id = env.register(ReputationScore, ());
    let user = Address::generate(&env);
    let client = ReputationScoreClient::new(&env, &contract_id);

    for i in 0..10 {
        client.record_attestation(&user, &1, &String::from_str(&env, &format!("attestation {}", i)));
    }

    assert_eq!(client.get_attestation_history(&user, &5).len(), 5);
}

#[test]
fn test_score_accumulates_correctly() {
    let env = Env::default();
    let contract_id = env.register(ReputationScore, ());
    let user = Address::generate(&env);
    let client = ReputationScoreClient::new(&env, &contract_id);

    client.record_attestation(&user, &50, &String::from_str(&env, "Excellent contributor"));
    client.record_attestation(&user, &(-10), &String::from_str(&env, "Spam"));
    client.record_attestation(&user, &25, &String::from_str(&env, "Great work"));

    assert_eq!(client.get_score(&user), 65);
}

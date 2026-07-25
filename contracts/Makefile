.PHONY: build test deploy-all deploy-identity-registry deploy-wallet-link deploy-reputation-score

SOROBAN = stellar
NETWORK = testnet
RPC_URL = https://soroban-testnet.stellar.org
NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"

build:
	cd identity-registry && $(SOROBAN) contract build
	cd wallet-link && $(SOROBAN) contract build
	cd reputation-score && $(SOROBAN) contract build

test:
	cd identity-registry && cargo test
	cd wallet-link && cargo test
	cd reputation-score && cargo test

deploy-identity-registry:
	$(SOROBAN) contract deploy \
		--wasm target/wasm32v1-none/release/identity_registry.wasm \
		--network $(NETWORK)

deploy-wallet-link:
	$(SOROBAN) contract deploy \
		--wasm target/wasm32v1-none/release/wallet_link.wasm \
		--network $(NETWORK)

deploy-reputation-score:
	$(SOROBAN) contract deploy \
		--wasm target/wasm32v1-none/release/reputation_score.wasm \
		--network $(NETWORK)

deploy-all: build deploy-identity-registry deploy-wallet-link deploy-reputation-score

init-identity-registry:
	@read -p "Contract ID: " id; \
	read -p "Admin address: " admin; \
	$(SOROBAN) contract invoke \
		--id $$id \
		--network $(NETWORK) \
		--source $$admin \
		-- \
		init --admin $$admin

init-reputation-score:
	@read -p "Contract ID: " id; \
	read -p "Admin address: " admin; \
	$(SOROBAN) contract invoke \
		--id $$id \
		--network $(NETWORK) \
		--source $$admin \
		-- \
		init --admin $$admin

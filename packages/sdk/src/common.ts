import { Contract, SorobanRpc, TransactionBuilder, Networks, scValToNative } from '@stellar/stellar-sdk';

declare global {
  interface Window {
    freighterApi?: {
      isConnected: () => Promise<boolean>;
      getAddress: () => Promise<string>;
      signTransaction: (xdr: string, opts: { networkPassphrase: string }) => Promise<string>;
    };
  }
}

export function getEnvConfig() {
  const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;
  const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET;
  const identityRegistryId = process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID;
  const walletLinkId = process.env.NEXT_PUBLIC_WALLET_LINK_CONTRACT_ID;
  const reputationScoreId = process.env.NEXT_PUBLIC_REPUTATION_SCORE_CONTRACT_ID;
  const simulationAccount = process.env.NEXT_PUBLIC_SIMULATION_ACCOUNT;

  if (!rpcUrl) throw new Error("Missing NEXT_PUBLIC_SOROBAN_RPC_URL");
  if (!identityRegistryId) throw new Error("Missing NEXT_PUBLIC_IDENTITY_REGISTRY_CONTRACT_ID");
  if (!walletLinkId) throw new Error("Missing NEXT_PUBLIC_WALLET_LINK_CONTRACT_ID");
  if (!reputationScoreId) throw new Error("Missing NEXT_PUBLIC_REPUTATION_SCORE_CONTRACT_ID");
  if (!simulationAccount) throw new Error("Missing NEXT_PUBLIC_SIMULATION_ACCOUNT");

  return {
    rpcUrl,
    networkPassphrase,
    identityRegistryId,
    walletLinkId,
    reputationScoreId,
    simulationAccount,
  };
}

export async function pollTransactionStatus(server: SorobanRpc.Server, txHash: string, timeoutMs = 60000, intervalMs = 2000): Promise<any> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const res = await server.getTransaction(txHash);
    if (res.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      return res;
    } else if (res.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`Transaction failed: ${JSON.stringify(res.resultXdr || res)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Transaction polling timed out for hash ${txHash}`);
}

export async function readContract(contractId: string, method: string, args: any[]) {
  const env = getEnvConfig();
  const server = new SorobanRpc.Server(env.rpcUrl);
  const contract = new Contract(contractId);
  const account = await server.getAccount(env.simulationAccount);
  const tx = new TransactionBuilder(account, { fee: '100', networkPassphrase: env.networkPassphrase })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();
  const sim = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) throw new Error(sim.error);
  if (!sim.result?.retval) return null;
  return scValToNative(sim.result.retval);
}

export async function writeContract(contractId: string, method: string, args: any[], sourcePublicKey: string) {
  const env = getEnvConfig();
  const server = new SorobanRpc.Server(env.rpcUrl);
  const contract = new Contract(contractId);
  const account = await server.getAccount(sourcePublicKey);
  let tx = new TransactionBuilder(account, { fee: '100', networkPassphrase: env.networkPassphrase })
    .addOperation(contract.call(method, ...args))
    .setTimeout(60)
    .build();
  const prepared = await server.prepareTransaction(tx);
  
  if (typeof window === 'undefined' || !window.freighterApi) {
    throw new Error("Freighter wallet API not available");
  }
  
  const signedXdr = await window.freighterApi.signTransaction(prepared.toXDR(), { networkPassphrase: env.networkPassphrase });
  const submitted = await server.sendTransaction(TransactionBuilder.fromXDR(signedXdr, env.networkPassphrase));
  return pollTransactionStatus(server, submitted.hash);
}

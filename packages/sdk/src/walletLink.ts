import { addressToScVal, stringToScVal, bytesToScVal, u32ToScVal } from './xdr';
import { readContract, writeContract, getEnvConfig } from './common';

export async function getNonce(owner: string): Promise<number> {
  const env = getEnvConfig();
  const args = [addressToScVal(owner)];
  try {
    const res = await readContract(env.walletLinkId, 'get_nonce', args);
    return Number(res ?? 0);
  } catch (err) {
    return 0;
  }
}

export async function linkSolanaWallet(
  owner: string,
  solanaPubkey: Buffer,
  signature: Buffer,
  sourcePublicKey: string
) {
  const env = getEnvConfig();
  const args = [
    addressToScVal(owner),
    bytesToScVal(solanaPubkey),
    bytesToScVal(signature),
  ];
  return writeContract(env.walletLinkId, 'link_solana_wallet', args, sourcePublicKey);
}

export async function linkEvmWallet(
  owner: string,
  chain: 'ethereum' | 'base',
  evmAddress: Buffer,
  messageHash: Buffer,
  signature: Buffer,
  recoveryId: number,
  sourcePublicKey: string
) {
  const env = getEnvConfig();
  const args = [
    addressToScVal(owner),
    stringToScVal(chain),
    bytesToScVal(evmAddress),
    bytesToScVal(messageHash),
    bytesToScVal(signature),
    u32ToScVal(recoveryId),
  ];
  return writeContract(env.walletLinkId, 'link_evm_wallet', args, sourcePublicKey);
}

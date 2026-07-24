import { getNonce } from '../walletLink';
import { hashMessage } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export async function signEvmChallenge(stellarAddress: string, chain: 'ethereum' | 'base') {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("EVM wallet (MetaMask) not found");
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error("No EVM accounts connected");
  }
  const evmAddressStr = accounts[0];
  const evmAddressBuffer = Buffer.from(evmAddressStr.replace('0x', ''), 'hex');
  if (evmAddressBuffer.length !== 20) {
    throw new Error("Invalid EVM address length");
  }

  const nonce = await getNonce(stellarAddress);
  const message = `NEXUSID_LINK:${stellarAddress}:${nonce}`;

  const signatureHex = await window.ethereum.request({
    method: 'personal_sign',
    params: [message, evmAddressStr],
  });

  const sigBytes = Buffer.from(signatureHex.replace('0x', ''), 'hex');
  if (sigBytes.length !== 65) {
    throw new Error("Invalid EVM signature length (expected 65 bytes)");
  }

  const r = sigBytes.subarray(0, 32);
  const s = sigBytes.subarray(32, 64);
  let v = sigBytes[64];

  let recoveryId = v;
  if (v >= 27) {
    recoveryId = v - 27;
  }
  if (recoveryId !== 0 && recoveryId !== 1) {
    throw new Error(`Invalid recovery id v=${v} (derived ${recoveryId})`);
  }

  // Recreate full signature buffer for contract (65 bytes with r, s, v or matching contract expectation)
  // Contract expects: signature: Buffer (65 bytes incl. v, split into r/s + recovery_id before encoding)
  // Let's pass the full 65-byte signature and recoveryId.
  const messageHashHex = hashMessage(message); // EIP-191 hash
  const messageHashBuffer = Buffer.from(messageHashHex.replace('0x', ''), 'hex');
  if (messageHashBuffer.length !== 32) {
    throw new Error("Invalid message hash length");
  }

  return {
    chain,
    evmAddress: evmAddressBuffer,
    messageHash: messageHashBuffer,
    signature: sigBytes,
    recoveryId,
  };
}

import { getNonce } from '../walletLink';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toBuffer(): Uint8Array; toString(): string } }>;
      signMessage: (message: Uint8Array, display?: string) => Promise<{ signature: Uint8Array; publicKey: { toBuffer(): Uint8Array } }>;
    };
  }
}

export async function signSolanaChallenge(stellarAddress: string) {
  if (typeof window === 'undefined' || !window.solana) {
    throw new Error("Solana wallet (Phantom) not found");
  }

  const response = await window.solana.connect();
  const pubkeyBuffer = response.publicKey.toBuffer(); // 32 bytes
  if (pubkeyBuffer.length !== 32) {
    throw new Error("Invalid Solana public key length");
  }

  const nonce = await getNonce(stellarAddress);
  const message = `NEXUSID_LINK:${stellarAddress}:${nonce}`;
  const encodedMessage = new TextEncoder().encode(message);

  const signedResult = await window.solana.signMessage(encodedMessage, 'utf8');
  const signatureBuffer = Buffer.from(signedResult.signature);
  if (signatureBuffer.length !== 64) {
    throw new Error("Invalid Solana signature length (expected 64 bytes)");
  }

  return {
    solanaPubkey: Buffer.from(pubkeyBuffer),
    signature: signatureBuffer,
  };
}

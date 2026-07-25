import { addressToScVal, i32ToScVal, stringToScVal, u32ToScVal } from './xdr';
import { readContract, writeContract, getEnvConfig } from './common';

export async function getScore(owner: string): Promise<number> {
  const env = getEnvConfig();
  const args = [addressToScVal(owner)];
  try {
    const res = await readContract(env.reputationScoreId, 'get_score', args);
    return Number(res ?? 0);
  } catch (err) {
    return 0;
  }
}

export async function getAttestationHistory(owner: string, limit: number): Promise<Array<{ attestor: string; delta: number; reason: string; ledger: number }>> {
  const env = getEnvConfig();
  const args = [addressToScVal(owner), u32ToScVal(limit)];
  try {
    const res = await readContract(env.reputationScoreId, 'get_attestation_history', args);
    return res || [];
  } catch (err) {
    return [];
  }
}

export async function recordAttestation(
  attestor: string,
  owner: string,
  delta: number,
  reason: string,
  sourcePublicKey: string,
): Promise<void> {
  const env = getEnvConfig();
  const args = [addressToScVal(attestor), addressToScVal(owner), i32ToScVal(delta), stringToScVal(reason)];
  await writeContract(env.reputationScoreId, 'record_attestation', args, sourcePublicKey);
}

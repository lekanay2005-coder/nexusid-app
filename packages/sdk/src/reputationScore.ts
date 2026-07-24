import { addressToScVal, u32ToScVal } from './xdr';
import { readContract, getEnvConfig } from './common';

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

import { addressToScVal, stringToScVal } from './xdr';
import { readContract, writeContract, getEnvConfig } from './common';

export async function createProfile(owner: string, metadataUri: string, sourcePublicKey: string) {
  const env = getEnvConfig();
  const args = [addressToScVal(owner), stringToScVal(metadataUri)];
  return writeContract(env.identityRegistryId, 'create_profile', args, sourcePublicKey);
}

export async function updateMetadata(owner: string, metadataUri: string, sourcePublicKey: string) {
  const env = getEnvConfig();
  const args = [addressToScVal(owner), stringToScVal(metadataUri)];
  return writeContract(env.identityRegistryId, 'update_metadata', args, sourcePublicKey);
}

export async function getProfile(owner: string): Promise<{ metadata_uri: string; created_ledger: number } | null> {
  const env = getEnvConfig();
  const args = [addressToScVal(owner)];
  try {
    const res = await readContract(env.identityRegistryId, 'get_profile', args);
    return res;
  } catch (err) {
    return null;
  }
}

export async function getLinks(owner: string): Promise<Array<[string, Buffer]>> {
  const env = getEnvConfig();
  const args = [addressToScVal(owner)];
  try {
    const res = await readContract(env.walletLinkId, 'get_links', args);
    return res || [];
  } catch (err) {
    return [];
  }
}

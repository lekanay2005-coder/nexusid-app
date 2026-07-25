import React from 'react';
import { getProfile, getLinks, getScore, getAttestationHistory } from '@nexusid/sdk';
import ProfileCard from '../../../components/ProfileCard';
import LinkedWalletsList from '../../../components/LinkedWalletsList';
import ReputationBadge from '../../../components/ReputationBadge';

export default async function PublicProfilePage({ params }: { params: { address: string } }) {
  const address = params.address;

  let profile = null;
  let links: Array<{ chain: string; externalAddress: string; ledger?: number }> = [];
  let score = 0;
  let attestations: any[] = [];

  try {
    profile = await getProfile(address);
    const rawLinks = await getLinks(address);
    links = rawLinks.map(([chain, extAddr]) => ({
      chain: String(chain),
      externalAddress: Buffer.isBuffer(extAddr) ? '0x' + extAddr.toString('hex') : String(extAddr),
    }));
    score = await getScore(address);
    attestations = await getAttestationHistory(address, 20);
  } catch (err) {
    console.error("Error fetching public profile", err);
  }

  if (!profile) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Profile Not Found</h2>
        <p className="text-slate-400 font-mono text-sm">{address}</p>
        <p className="text-slate-500 text-sm">No profile registered on-chain for this address.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Public Profile</h1>

      <ProfileCard
        owner={address}
        metadataUri={profile.metadata_uri}
        createdLedger={profile.created_ledger}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LinkedWalletsList links={links} />
        <ReputationBadge score={score} attestations={attestations} />
      </div>
    </div>
  );
}

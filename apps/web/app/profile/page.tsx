'use client';
import { useState, useEffect } from 'react';
import { getProfile, getLinks, createProfile, updateMetadata, getScore, getAttestationHistory } from '@nexusid/sdk';
import ProfileCard from '../../components/ProfileCard';
import LinkedWalletsList from '../../components/LinkedWalletsList';
import ReputationBadge from '../../components/ReputationBadge';

export default function ProfilePage() {
  const [address, setAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ metadata_uri: string; created_ledger?: number } | null>(null);
  const [links, setLinks] = useState<Array<{ chain: string; externalAddress: string; ledger?: number }>>([]);
  const [score, setScore] = useState<number>(0);
  const [attestations, setAttestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states for profile creation/update
  const [metadataUri, setMetadataUri] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        if (typeof window !== 'undefined' && window.freighterApi) {
          const isConnected = await window.freighterApi.isConnected();
          if (isConnected) {
            const addr = await window.freighterApi.getAddress();
            if (addr) {
              setAddress(addr);
              loadProfileData(addr);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  async function loadProfileData(addr: string) {
    setLoading(true);
    setError(null);
    try {
      const p = await getProfile(addr);
      setProfile(p);
      if (p) {
        setMetadataUri(p.metadata_uri);
      }

      const rawLinks = await getLinks(addr);
      // Format links array
      const formattedLinks = rawLinks.map(([chain, extAddr]) => ({
        chain: String(chain),
        externalAddress: Buffer.isBuffer(extAddr) ? '0x' + extAddr.toString('hex') : String(extAddr),
      }));
      setLinks(formattedLinks);

      const s = await getScore(addr);
      setScore(s);

      const history = await getAttestationHistory(addr, 20);
      setAttestations(history);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      await createProfile(address, metadataUri, address);
      await loadProfileData(address);
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateMetadata(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      await updateMetadata(address, metadataUri, address);
      await loadProfileData(address);
    } catch (err: any) {
      setError(err.message || "Failed to update metadata");
    } finally {
      setLoading(false);
    }
  }

  if (!address) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
        <p className="text-slate-400">Please connect your Freighter wallet to view or create your NexusID profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <button
          onClick={() => loadProfileData(address)}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm font-medium px-4 py-2 rounded-xl transition border border-slate-700"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/60 border border-red-800 text-red-300 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!profile ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-xl font-semibold text-white">Create Your NexusID Profile</h2>
          <p className="text-sm text-slate-400">You do not have a profile registered on-chain yet. Create one below to get started.</p>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">Metadata URI (IPFS / URL)</label>
              <input
                type="text"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                placeholder="https://arweave.net/... or ipfs://..."
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Register Profile On-Chain'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <ProfileCard
            owner={address}
            metadataUri={profile.metadata_uri}
            createdLedger={profile.created_ledger}
          />

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Update Metadata URI</h3>
            <form onSubmit={handleUpdateMetadata} className="flex gap-4">
              <input
                type="text"
                value={metadataUri}
                onChange={(e) => setMetadataUri(e.target.value)}
                required
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                Update
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LinkedWalletsList links={links} />
            <ReputationBadge score={score} attestations={attestations} />
          </div>
        </div>
      )}
    </div>
  );
}

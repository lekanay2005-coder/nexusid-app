'use client';
import { useState } from 'react';
import { signSolanaChallenge, linkSolanaWallet, signEvmChallenge, linkEvmWallet } from '@nexusid/sdk';

interface ChainLinkFlowProps {
  stellarAddress: string;
  onLinked?: () => void;
}

export default function ChainLinkFlow({ stellarAddress, onLinked }: ChainLinkFlowProps) {
  const [selectedChain, setSelectedChain] = useState<'solana' | 'ethereum' | 'base'>('solana');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleLink() {
    if (!stellarAddress) {
      setError("Please connect your Stellar wallet first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedChain === 'solana') {
        const { solanaPubkey, signature } = await signSolanaChallenge(stellarAddress);
        await linkSolanaWallet(stellarAddress, solanaPubkey, signature, stellarAddress);
        setSuccess("Successfully linked Solana wallet!");
      } else {
        const { chain, evmAddress, messageHash, signature, recoveryId } = await signEvmChallenge(stellarAddress, selectedChain);
        await linkEvmWallet(stellarAddress, chain, evmAddress, messageHash, signature, recoveryId, stellarAddress);
        setSuccess(`Successfully linked ${chain.toUpperCase()} wallet!`);
      }
      if (onLinked) onLinked();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to complete wallet linking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Link External Wallet</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 block">Select Chain</label>
          <div className="grid grid-cols-3 gap-3">
            {(['solana', 'ethereum', 'base'] as const).map((chain) => (
              <button
                key={chain}
                type="button"
                onClick={() => setSelectedChain(chain)}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium capitalize border transition ${selectedChain === chain ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'}`}
              >
                {chain}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLink}
          disabled={loading || !stellarAddress}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {loading ? 'Signing & Linking...' : `Link ${selectedChain.toUpperCase()} Wallet`}
        </button>

        {error && (
          <div className="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-sm">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

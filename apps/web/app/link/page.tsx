'react';
import React, { useState, useEffect } from 'react';
import ChainLinkFlow from '../../components/ChainLinkFlow';

export default function LinkPage() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        if (typeof window !== 'undefined' && window.freighterApi) {
          const isConnected = await window.freighterApi.isConnected();
          if (isConnected) {
            const addr = await window.freighterApi.getAddress();
            if (addr) setAddress(addr);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Cross-Chain Wallet Linking</h1>
        <p className="text-slate-400">
          Cryptographically sign challenges with your Solana or EVM wallets and link them securely to your Stellar NexusID.
        </p>
      </div>

      {!address ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Stellar Wallet Required</h2>
          <p className="text-sm text-slate-400">Please connect your Freighter wallet in the header before linking external chains.</p>
        </div>
      ) : (
        <ChainLinkFlow stellarAddress={address} />
      )}
    </div>
  );
}

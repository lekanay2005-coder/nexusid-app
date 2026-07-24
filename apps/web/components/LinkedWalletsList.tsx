import React from 'react';

interface LinkedWalletsListProps {
  links: Array<{ chain: string; externalAddress: string; ledger?: number }>;
}

export default function LinkedWalletsList({ links }: LinkedWalletsListProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Linked External Wallets</h3>
      {links.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No external wallets linked yet.</p>
      ) : (
        <div className="space-y-3">
          {links.map((link, idx) => (
            <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  {link.chain}
                </span>
                <p className="text-sm font-mono text-slate-200 mt-2 break-all">
                  {link.externalAddress}
                </p>
              </div>
              {link.ledger && (
                <span className="text-xs text-slate-400 font-mono">
                  Ledger {link.ledger}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

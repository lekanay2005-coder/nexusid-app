import React from 'react';

interface ReputationBadgeProps {
  score: number;
  attestations?: Array<{ attestor: string; delta: number; reason: string; ledger: number }>;
}

export default function ReputationBadge({ score, attestations = [] }: ReputationBadgeProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">Reputation Score</h3>
        <span className={`text-2xl font-bold font-mono px-3 py-1 rounded-xl ${score >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-red-950 text-red-400 border border-red-800/50'}`}>
          {score > 0 ? `+${score}` : score}
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Attestation History</h4>
        {attestations.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No attestations recorded yet.</p>
        ) : (
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {attestations.map((att, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-200 font-medium">{att.reason || 'Attestation'}</p>
                  <p className="text-xs text-slate-400 font-mono">By: {att.attestor.slice(0, 6)}...{att.attestor.slice(-4)} (Ledger {att.ledger})</p>
                </div>
                <span className={`font-mono font-semibold ${att.delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {att.delta > 0 ? `+${att.delta}` : att.delta}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';

interface ProfileCardProps {
  owner: string;
  metadataUri: string;
  createdLedger?: number;
}

export default function ProfileCard({ owner, metadataUri, createdLedger }: ProfileCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">NexusID Profile</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Stellar Address</label>
          <p className="text-sm font-mono text-slate-200 bg-slate-800 p-3 rounded-xl mt-1 break-all border border-slate-700/50">
            {owner}
          </p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Metadata URI</label>
          <p className="text-sm text-slate-300 bg-slate-800 p-3 rounded-xl mt-1 break-all border border-slate-700/50">
            {metadataUri}
          </p>
        </div>
        {createdLedger !== undefined && (
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Created Ledger</label>
            <p className="text-sm font-mono text-slate-300 mt-1">
              {createdLedger}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

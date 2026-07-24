import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Unified Cross-Chain Identity on <span className="text-indigo-400">Soroban</span>
        </h1>
        <p className="text-lg text-slate-400">
          Connect your Stellar identity, link Solana and EVM wallets cryptographically, and manage your decentralized reputation score seamlessly.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/profile"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            Manage Profile
          </Link>
          <Link
            href="/link"
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium px-6 py-3 rounded-xl transition"
          >
            Link Wallets
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold">01</div>
          <h3 className="text-lg font-semibold text-slate-200">Identity Registry</h3>
          <p className="text-sm text-slate-400">Create and manage your sovereign identity profile anchored on Stellar Soroban contracts.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold">02</div>
          <h3 className="text-lg font-semibold text-slate-200">Cross-Chain Linking</h3>
          <p className="text-sm text-slate-400">Cryptographically prove ownership and link your Solana and EVM (Ethereum & Base) wallets securely.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold">03</div>
          <h3 className="text-lg font-semibold text-slate-200">Reputation Score</h3>
          <p className="text-sm text-slate-400">Track attestations, view transparent deltas, and build verifiable cross-chain reputation.</p>
        </div>
      </div>
    </div>
  );
}

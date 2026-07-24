import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import WalletConnectButton from '../components/WalletConnectButton';

export const metadata = {
  title: 'NexusID - Cross-Chain Identity Layer',
  description: 'Decentralized identity, wallet linking, and reputation score on Soroban & Stellar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                NexusID
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                <Link href="/profile" className="hover:text-white transition">My Profile</Link>
                <Link href="/link" className="hover:text-white transition">Link Wallets</Link>
              </nav>
            </div>
            <div>
              <WalletConnectButton />
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-slate-800 bg-slate-900/40 py-6 text-center text-xs text-slate-500">
          NexusID Application Layer • Powered by Stellar Soroban
        </footer>
      </body>
    </html>
  );
}

'react';
import React, { useState, useEffect } from 'react';

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void;
}

export default function WalletConnectButton({ onConnect }: WalletConnectButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        if (typeof window !== 'undefined' && window.freighterApi) {
          const isConnected = await window.freighterApi.isConnected();
          if (isConnected) {
            const res = await window.freighterApi.getAddress();
            if (res && typeof res === 'string') {
              setAddress(res);
              if (onConnect) onConnect(res);
            }
          }
        }
      } catch (err) {
        console.error("Error checking Freighter connection", err);
      }
    }
    checkConnection();
  }, [onConnect]);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    try {
      if (typeof window === 'undefined' || !window.freighterApi) {
        throw new Error("Freighter wallet is not installed");
      }
      const res = await window.freighterApi.getAddress();
      if (res) {
        setAddress(res);
        if (onConnect) onConnect(res);
      } else {
        setError("Failed to get address from Freighter");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }

  function handleDisconnect() {
    setAddress(null);
    if (onConnect) onConnect('');
  }

  if (address) {
    return (
      <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-mono text-slate-200">
          {address.slice(0, 4)}...{address.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
          className="text-xs text-slate-400 hover:text-white ml-2 underline"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
      >
        {loading ? 'Connecting...' : 'Connect Freighter'}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

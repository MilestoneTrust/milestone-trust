'use client';

import { useState, useEffect } from 'react';
import { isFreighterInstalled, connectFreighter, truncateAddress } from '@/lib/stellar/freighter';

interface WalletConnectProps {
  onConnect?: (publicKey: string) => void;
  onDisconnect?: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkWallet = async () => {
      const installed = await isFreighterInstalled();
      setIsInstalled(installed);
    };
    checkWallet();
  }, []);

  const handleConnect = async () => {
    if (!isInstalled) {
      window.open('https://www.freighter.app/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const key = await connectFreighter();
      setPublicKey(key);
      onConnect?.(key);
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet. Please make sure Freighter is unlocked.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setPublicKey(null);
    onDisconnect?.();
  };

  return (
    <div>
      {publicKey ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">
            {truncateAddress(publicKey)}
          </span>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : isInstalled ? 'Connect Wallet' : 'Install Freighter'}
        </button>
      )}
    </div>
  );
}
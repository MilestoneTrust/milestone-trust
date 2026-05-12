// Freighter wallet integration for Stellar

// Declare the Freighter API type
declare global {
  interface Window {
    freighterApi?: {
      getPublicKey(): Promise<string>;
      isConnected(): Promise<boolean>;
      signTransaction(xdr: string, opts?: { network?: string }): Promise<{ signedXDR: string }>;
    };
  }
}

export async function isFreighterInstalled(): Promise<boolean> {
  return typeof window !== 'undefined' && typeof window.freighterApi !== 'undefined';
}

export async function connectFreighter(): Promise<string> {
  if (!isFreighterInstalled()) {
    throw new Error('Freighter wallet not installed');
  }

  try {
    const publicKey = await window.freighterApi!.getPublicKey();
    return publicKey;
  } catch (error) {
    console.error('Failed to connect Freighter:', error);
    throw error;
  }
}

export async function signTransaction(xdr: string, network?: string): Promise<string> {
  if (!isFreighterInstalled()) {
    throw new Error('Freighter wallet not installed');
  }

  try {
    const { signedXDR } = await window.freighterApi!.signTransaction(xdr, {
      network: network || 'TESTNET',
    });
    return signedXDR;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
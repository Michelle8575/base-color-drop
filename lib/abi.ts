import type { Address } from 'viem';

export const colorDropAbi = [
  {
    type: 'function',
    name: 'dropColor',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'color', type: 'uint8' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'latestColor',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'userDrops',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'colorCounts',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint8' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalDrops',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'ColorDropped',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'color', type: 'uint8', indexed: false },
      { name: 'userDrops', type: 'uint256', indexed: false },
      { name: 'totalDrops', type: 'uint256', indexed: false },
    ],
  },
] as const;

const configuredAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xb44567b631e0afa377212a1d217a032cee20083a';

export const contractAddress =
  configuredAddress && /^0x[a-fA-F0-9]{40}$/.test(configuredAddress)
    ? (configuredAddress as Address)
    : undefined;

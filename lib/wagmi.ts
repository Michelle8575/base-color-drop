'use client';

import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

const defaultBuildCode = 'bc_1o306iq6';
const defaultDataSuffix = '0x62635f316f3330366971360b0080218021802180218021802180218021';
const configuredBuildCode = process.env.NEXT_PUBLIC_BUILD_CODE;
const configuredDataSuffix = process.env.NEXT_PUBLIC_DATA_SUFFIX;

export const buildCode = configuredBuildCode || defaultBuildCode;

export const dataSuffix =
  configuredDataSuffix && /^0x([a-fA-F0-9]{2})*$/.test(configuredDataSuffix)
    ? (configuredDataSuffix as `0x${string}`)
    : (defaultDataSuffix as `0x${string}`);

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
      target: {
        id: 'base-app',
        name: 'Base App Wallet',
        provider(window) {
          return window?.ethereum;
        },
      },
      unstable_shimAsyncInject: 1_000,
    }),
    injected({
      shimDisconnect: true,
      target: 'metaMask',
      unstable_shimAsyncInject: 1_000,
    }),
    injected({
      shimDisconnect: true,
      target: 'okxWallet',
      unstable_shimAsyncInject: 1_000,
    }),
    coinbaseWallet({
      appName: 'Base Color Drop',
      appLogoUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/icon.png`,
      preference: 'all',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
  dataSuffix,
});

'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import {
  Check,
  ChevronDown,
  CircleDot,
  ExternalLink,
  PlugZap,
  Power,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Hex } from 'viem';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { colorDropAbi, contractAddress } from '@/lib/abi';
import { dataSuffix } from '@/lib/wagmi';

const COLORS = [
  { id: 0, name: 'Blue', hex: '#0052ff', text: '#ffffff' },
  { id: 1, name: 'Red', hex: '#ff2d2d', text: '#ffffff' },
  { id: 2, name: 'Yellow', hex: '#ffd400', text: '#050505' },
  { id: 3, name: 'Green', hex: '#16a34a', text: '#ffffff' },
  { id: 4, name: 'Black', hex: '#050505', text: '#ffffff' },
] as const;

type ColorId = (typeof COLORS)[number]['id'];

function formatAddress(address?: string) {
  if (!address) return 'Disconnected';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatBigInt(value?: bigint) {
  return value === undefined ? '-' : value.toString();
}

function getExplorerUrl(hash: Hex) {
  return `https://basescan.org/tx/${hash}`;
}

export function ColorDropApp() {
  const [selectedColor, setSelectedColor] = useState<ColorId>(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [lastStatus, setLastStatus] = useState('No transaction yet');
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContract, data: hash, isPending: isWriting, error, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isReceiptError,
  } = useWaitForTransactionReceipt({ hash });

  const activeColor = COLORS[selectedColor];
  const isWrongNetwork = isConnected && chainId !== base.id;
  const canRead = Boolean(contractAddress);
  const actionLabel = !isConnected
    ? 'Connect Wallet'
    : !contractAddress
      ? 'Contract Address Required'
      : isWrongNetwork
        ? 'Switch to Base'
        : isWriting || isConfirming
          ? 'Dropping...'
          : 'Drop Color';

  const {
    data: latestColorData,
    refetch: refetchLatest,
    isFetched: latestFetched,
  } = useReadContract({
    address: contractAddress,
    abi: colorDropAbi,
    functionName: 'latestColor',
    args: address ? [address] : undefined,
    query: {
      enabled: canRead && Boolean(address),
    },
  });

  const { data: userDropsData, refetch: refetchUserDrops } = useReadContract({
    address: contractAddress,
    abi: colorDropAbi,
    functionName: 'userDrops',
    args: address ? [address] : undefined,
    query: {
      enabled: canRead && Boolean(address),
    },
  });

  const { data: totalDropsData, refetch: refetchTotalDrops } = useReadContract({
    address: contractAddress,
    abi: colorDropAbi,
    functionName: 'totalDrops',
    query: {
      enabled: canRead,
    },
  });

  const { data: colorCountsData, refetch: refetchColorCounts } = useReadContracts({
    contracts: COLORS.map((color) => ({
      address: contractAddress,
      abi: colorDropAbi,
      functionName: 'colorCounts',
      args: [color.id],
    })),
    query: {
      enabled: canRead,
    },
  });

  const latestColor =
    userDropsData && userDropsData > 0n && typeof latestColorData === 'number'
      ? COLORS[latestColorData]
      : undefined;
  const totalDrops = totalDropsData ?? 0n;
  const userDrops = userDropsData ?? 0n;
  const colorCounts = colorCountsData?.map((result) =>
    result.status === 'success' ? (result.result as bigint) : 0n,
  );

  useEffect(() => {
    void sdk.actions.ready();
  }, []);

  useEffect(() => {
    if (isWriting) setLastStatus('Waiting for wallet approval');
    if (isConfirming) setLastStatus('Transaction pending');
    if (isConfirmed) setLastStatus('Transaction confirmed');
    if (isReceiptError || error) setLastStatus('Transaction failed');
  }, [error, isConfirmed, isConfirming, isReceiptError, isWriting]);

  useEffect(() => {
    if (!isConfirmed) return;

    void refetchLatest();
    void refetchUserDrops();
    void refetchTotalDrops();
    void refetchColorCounts();
  }, [
    isConfirmed,
    refetchColorCounts,
    refetchLatest,
    refetchTotalDrops,
    refetchUserDrops,
  ]);

  function connectWallet(connectorId: string) {
    const selectedConnector = connectors.find((item) => item.uid === connectorId);
    if (!selectedConnector) return;
    connect(
      { connector: selectedConnector },
      {
        onError: (connectError) => {
          setLastStatus(connectError.message || 'Wallet connection failed');
        },
      },
    );
    setWalletOpen(false);
  }

  function dropColor(color: ColorId) {
    if (!isConnected) {
      setWalletOpen(true);
      setLastStatus('Choose a wallet first');
      return;
    }

    if (!contractAddress) {
      setLastStatus('Contract address required');
      return;
    }

    reset();

    if (isWrongNetwork) {
      switchChain({ chainId: base.id });
      return;
    }

    writeContract({
      address: contractAddress,
      abi: colorDropAbi,
      functionName: 'dropColor',
      args: [color],
      chainId: base.id,
      dataSuffix,
    });
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(90deg,rgba(5,5,5,0.06)_1px,transparent_1px)] bg-[length:24px_24px] p-3 text-ink md:p-5">
      <section className="grid min-h-[calc(100vh-24px)] grid-cols-[58px_1fr] border-2 border-ink bg-paper md:min-h-[calc(100vh-40px)] md:grid-cols-[88px_1.15fr_0.85fr] lg:grid-cols-[104px_minmax(460px,1.2fr)_minmax(420px,0.8fr)]">
        <div className="row-span-7 flex items-center justify-between border-r-[12px] border-baseBlue bg-ink px-0 py-4 text-paper [writing-mode:vertical-rl] [transform:rotate(180deg)] md:row-span-5 md:border-r-[18px]">
          <span className="text-lg font-black uppercase md:text-[22px]">Base</span>
          <span className="text-lg font-black uppercase md:text-[22px]">Color</span>
          <span className="text-lg font-black uppercase md:text-[22px]">Drop</span>
        </div>

        <header className="border-b-2 border-ink p-5 md:border-r-2 md:p-8 lg:p-10">
          <p className="text-[11px] font-black uppercase leading-none">Onchain Color Vote Mini App</p>
          <h1 className="mt-3 max-w-[850px] text-[44px] font-black uppercase leading-[0.88] md:text-[86px] lg:text-[132px]">
            Drop your latest color on Base.
          </h1>
          <p className="mt-5 max-w-xl text-sm font-bold uppercase leading-tight md:text-base">
            No token. No points. No invite loop. You only pay Base gas.
          </p>
        </header>

        <section className="border-b-2 border-ink" aria-label="Wallet Status">
          <Metric label="Wallet Status" value={isConnected ? formatAddress(address) : 'Disconnected'} note={connector?.name ?? 'Choose a wallet'} />
          <Metric label="Contract" value={contractAddress ? 'Configured' : 'Missing'} note={contractAddress ?? 'Set NEXT_PUBLIC_CONTRACT_ADDRESS'} />
          <Metric label="Attribution" value={dataSuffix !== '0x' ? 'Enabled' : 'Pending'} note="Explicit dataSuffix on every write" last />
        </section>

        <section className="border-b-2 border-ink md:col-start-3" aria-label="Wallet Connect">
          <div className="relative">
            <button
              type="button"
              className="flex min-h-[64px] w-full items-center justify-between border-b-2 border-ink bg-paper px-4 py-3 text-left font-black uppercase hover:bg-ink hover:text-paper"
              onClick={() => setWalletOpen((open) => !open)}
            >
              <span>{isConnected ? 'Wallet Options' : 'Connect Wallet'}</span>
              <Wallet aria-hidden="true" size={18} />
            </button>

            {walletOpen && (
              <div className="absolute left-0 right-0 top-full z-20 border-x-2 border-b-2 border-ink bg-paper">
                {connectors.map((availableConnector) => (
                  <button
                    key={availableConnector.uid}
                    type="button"
                    className="flex min-h-[52px] w-full items-center justify-between border-b-2 border-ink px-4 py-3 text-left text-sm font-black uppercase last:border-b-0 hover:bg-baseBlue hover:text-white"
                    onClick={() => connectWallet(availableConnector.uid)}
                    disabled={isConnecting}
                  >
                    <span>{availableConnector.name}</span>
                    <ChevronDown aria-hidden="true" size={16} />
                  </button>
                ))}
                {isConnected && (
                  <button
                    type="button"
                    className="flex min-h-[52px] w-full items-center justify-between px-4 py-3 text-left text-sm font-black uppercase hover:bg-signalRed hover:text-white"
                    onClick={() => {
                      disconnect();
                      setWalletOpen(false);
                    }}
                  >
                    Disconnect
                    <Power aria-hidden="true" size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
          {isWrongNetwork && (
            <button
              type="button"
              className="flex min-h-[54px] w-full items-center justify-between bg-signalYellow px-4 py-3 text-left font-black uppercase"
              onClick={() => switchChain({ chainId: base.id })}
              disabled={isSwitching}
            >
              Switch to Base
              <PlugZap aria-hidden="true" size={18} />
            </button>
          )}
        </section>

        <section className="grid border-b-2 border-ink md:col-span-2 md:grid-cols-[1.35fr_0.8fr_0.8fr]" aria-label="Onchain Results">
          <MetricBlock label="My Color" value={latestFetched ? latestColor?.name ?? '-' : '-'} color={latestColor?.hex} large />
          <MetricBlock label="My Drops" value={formatBigInt(userDrops)} />
          <MetricBlock label="Total Drops" value={formatBigInt(totalDrops)} last />
        </section>

        <section className="border-b-2 border-ink md:border-r-2" aria-label="Drop Color">
          <div className="grid">
            {COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                className="flex min-h-[72px] items-center justify-between border-b-2 border-ink px-4 py-4 text-[25px] font-black uppercase"
                style={{
                  background: color.hex,
                  color: color.text,
                  boxShadow: selectedColor === color.id ? 'inset 0 0 0 8px #ffffff' : undefined,
                }}
                onClick={() => setSelectedColor(color.id)}
              >
                <span>{color.name}</span>
                {selectedColor === color.id && <CircleDot aria-hidden="true" size={18} />}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex min-h-[104px] w-full items-center justify-between bg-baseBlue px-4 py-5 text-left text-[28px] font-black uppercase text-white md:text-[34px]"
            onClick={() => dropColor(activeColor.id)}
            disabled={isWriting || isConfirming}
          >
            {actionLabel}
            <ChevronDown aria-hidden="true" size={22} />
          </button>
          <p className="border-t-2 border-ink px-4 py-3 text-xs font-black uppercase leading-tight">
            Selected color: {activeColor.name}. Choose any color, then press the main action.
          </p>
        </section>

        <section className="border-b-2 border-ink md:row-span-2 md:border-b-0" aria-label="Color Board">
          <div className="border-b-2 border-ink p-4 md:p-6">
            <p className="text-[11px] font-black uppercase leading-none">Color Board</p>
            <strong className="mt-2 block text-3xl font-black uppercase leading-none md:text-4xl">
              Live Counts
            </strong>
          </div>
          {COLORS.map((color, index) => {
            const count = colorCounts?.[index] ?? 0n;
            const percent = totalDrops > 0n ? Number((count * 100n) / totalDrops) : 0;

            return (
              <div
                className="grid min-h-14 grid-cols-[28px_minmax(70px,0.8fr)_minmax(80px,1fr)_auto] items-center gap-2 border-b-2 border-ink px-4 py-2 font-black uppercase last:border-b-0 md:px-6"
                key={color.id}
              >
                <span className="h-7 w-7 border-2 border-ink" style={{ background: color.hex }} />
                <span>{color.name}</span>
                <div className="h-4 border-2 border-ink bg-white" aria-hidden="true">
                  <i className="block h-full" style={{ width: `${percent}%`, background: color.hex }} />
                </div>
                <strong>{count.toString()}</strong>
              </div>
            );
          })}
        </section>

        <footer className="min-w-0 p-4 md:p-6" aria-label="Last Transaction">
          <p className="text-[11px] font-black uppercase leading-none">Last Transaction</p>
          <strong className="mt-2 block text-2xl font-black uppercase leading-none">
            {lastStatus}
          </strong>
          {hash ? (
            <a
              className="mt-3 inline-flex items-center gap-2 text-lg font-black uppercase text-ink hover:text-baseBlue"
              href={getExplorerUrl(hash)}
              target="_blank"
              rel="noreferrer"
            >
              {isConfirmed && <Check aria-hidden="true" size={16} />}
              {formatAddress(hash)}
              <ExternalLink aria-hidden="true" size={16} />
            </a>
          ) : null}
          {(error || isReceiptError) && (
            <small className="mt-3 flex items-start gap-2 break-words text-xs font-bold uppercase leading-tight">
              <X aria-hidden="true" size={15} />
              {error?.message ?? 'Receipt failed'}
            </small>
          )}
        </footer>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  note,
  last,
}: {
  label: string;
  value: string;
  note: string;
  last?: boolean;
}) {
  return (
    <div className={`min-w-0 p-4 ${last ? '' : 'border-b-2 border-ink'} md:p-6`}>
      <p className="text-[11px] font-black uppercase leading-none">{label}</p>
      <strong className="mt-2 block break-words text-[28px] font-black uppercase leading-none md:text-4xl">
        {value}
      </strong>
      <small className="mt-2 block break-words text-xs font-bold leading-tight">{note}</small>
    </div>
  );
}

function MetricBlock({
  label,
  value,
  color,
  large,
  last,
}: {
  label: string;
  value: string;
  color?: string;
  large?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`relative min-w-0 p-4 md:p-6 ${last ? '' : 'border-b-2 border-ink md:border-b-0 md:border-r-2'}`}>
      <p className="text-[11px] font-black uppercase leading-none">{label}</p>
      <strong
        className={`mt-2 block break-words font-black uppercase leading-none ${
          large ? 'text-[54px] md:text-7xl' : 'text-[34px] md:text-4xl'
        }`}
      >
        {value}
      </strong>
      {color && <i className="absolute bottom-4 right-4 h-14 w-14 border-2 border-ink" style={{ background: color }} />}
    </div>
  );
}

# Base Color Drop

Base Color Drop is a zero-reward, zero-token onchain color vote Mini App for Base.

## Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Tailwind CSS

## Setup

1. Deploy `contracts/BaseColorDrop.sol` on Base.
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_DATA_SUFFIX` after Base Builder Code is available
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_BASE_BUILDER_OWNER`
3. Replace the hardcoded `base:app_id` token in `app/layout.tsx`.
4. Replace `accountAssociation` in `public/.well-known/farcaster.json` after signing the domain in Base Build Preview.
5. Run:

```bash
npm install
npm run dev
```

## Attribution

- Offchain attribution: `app/layout.tsx` includes a hardcoded `<meta name="base:app_id" ... />`.
- Onchain attribution: `lib/wagmi.ts` configures `dataSuffix`, and every `writeContract` call explicitly passes `dataSuffix`.

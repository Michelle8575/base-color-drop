# BaseColorDrop

BaseColorDrop is a simple onchain color voting Mini App for Base.

The project lets visitors choose a color and submit that choice onchain through a lightweight web interface.

Voting is for participation only. There are no rewards or incentives attached to submitting a vote.

Repository: https://github.com/Michelle8575/base-color-drop.git

## Overview

BaseColorDrop is a small, focused Mini App for collecting color votes on Base.

It includes a frontend built with Next.js and a Solidity contract located in the `contracts` directory.

The app is designed to be easy to run locally, configure for deployment, and connect to a deployed contract.

## Features

- Onchain color voting on Base
- Mini App structure
- Next.js App Router frontend
- TypeScript support
- Wallet and contract interaction with Wagmi and Viem
- Tailwind CSS styling
- Environment-based configuration
- Base attribution support through metadata and transaction data
- Solidity contract source included in the repository

## Tech Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Tailwind CSS
- Solidity

## Repository Structure

```text
app/                    Next.js App Router files
contracts/              Solidity contract source
lib/                    Shared app configuration and utilities
public/                 Static assets and well-known configuration
.env.example            Example environment configuration
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- A deployed instance of `contracts/BaseColorDrop.sol` on Base
- The required environment values for your deployment

## Setup

Clone the repository:

```bash
git clone https://github.com/Michelle8575/base-color-drop.git
cd base-color-drop
```

Install dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with the required values:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_DATA_SUFFIX=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_BASE_BUILDER_OWNER=
```

Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the address of your deployed `BaseColorDrop.sol` contract.

Set `NEXT_PUBLIC_DATA_SUFFIX` after the Base Builder Code value is available.

Set `NEXT_PUBLIC_APP_URL` to the public URL where the app will be hosted.

Set `NEXT_PUBLIC_BASE_BUILDER_OWNER` to the appropriate Base Builder owner value for your deployment.

## Base and Farcaster Configuration

Update the Base app metadata in `app/layout.tsx`.

The file includes a hardcoded `<meta name="base:app_id" ... />` value that should be replaced for your deployment.

Update the Farcaster domain association file at:

```text
public/.well-known/farcaster.json
```

Replace the placeholder association data after signing the domain in Base Build Preview.

## Running Locally

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in your terminal.

The app should load using the configured contract address and environment values.

## Usage

1. Deploy `contracts/BaseColorDrop.sol` on Base.
2. Configure `.env.local` with your deployment values.
3. Update the Base app metadata in `app/layout.tsx`.

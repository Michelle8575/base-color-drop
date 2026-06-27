# BaseColorDrop

BaseColorDrop is a simple onchain color voting Mini App for Base.

The project lets users choose a color and submit that choice onchain through a lightweight web interface.

There are no rewards or incentives attached to voting.

Repository: https://github.com/Michelle8575/base-color-drop.git

## Overview

BaseColorDrop is built as a small, focused Mini App for collecting color votes on Base.

The app includes a frontend built with Next.js and a Solidity contract located in the `contracts` directory.

It is intended to be easy to run locally, configure for deployment, and connect to a deployed contract.

## Features

- Onchain color voting on Base
- Mini App structure
- Next.js App Router frontend
- TypeScript support
- Wallet and contract interaction through Wagmi and Viem
- Tailwind CSS styling
- Environment-based configuration
- Base attribution support through metadata and transaction data

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

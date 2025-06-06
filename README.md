<p align="center">
  <a href="https://streamflo.netlify.app/">
    <img src="./public/logo.png" alt="Streamflow Logo" style="max-width:100%;" width="200">
  </a>
</p>

<br />

# 💻 &nbsp; Streamflow Airdropper

The app create a permissionless airdrop on [Streamflow](https://app.streamflow.finance/). Users can view all airdrops, available airdrops for their connected wallet and claim tokens.
Streamflow ony supports Solana at the moment so the app is build on Solana Devnet Cluster.

### Tech Stack

- **Frontend:** [React Router + Vite]("https://reactrouter.com/start/declarative/installation), [Shadcn UI](https://ui.shadcn.com/) .
- **Solana:** [solana web3.js](https://www.npmjs.com/package/@solana/web3.js/v/0.30.8), [spl-token](https://www.npmjs.com/package/@solana/spl-token) .
- **Streamflow:** [Streamflow JS SDK](https://github.com/streamflow-finance/js-sdk), [Streamflow API](https://api-public.streamflow.finance/v2/docs#tag/airdrops) .
- **Hosting:** Currently hosted [Vercel](https://vercel.com/) and [Netlify](https://www.netlify.com/) .
- **Proxy Server:** Currently hostend on [Deno Deploy](https://deno.com/deploy) .

## 💾 &nbsp; Getting Started

### Prerequisites

- Node.js [https://nodejs.org/en/download]
- Bun [https://bun.sh/install]

### Installation

- Clone the repository

```bash
git clone https://github.com/Complexlity/streamflow-airdropper.git
cd streamflow-airdropper
```

- Install dependencies

```bash
bun install //or npm install or pnpm install
```

- Update Env

```bash
echo 'VITE_PROXY_SERVER_URL=https://share-worm-84.deno.dev' > .env
```

- Start the app

```bash
bun run dev
```

Navigate to http://localhost:3000

## 📁 &nbsp; Folder Structure

- `src`: All files needeed for the app to run
  - `components`: React components comprising of all views and components
    - `airdrop`: Airdrop related components
    - `ui`: standalone ui components mostly [Shadcn UI](https://ui.shadcn.com/)
  - `config`: App configuration including constants, env
  - `hooks`: Custom hooks use through the app
    - `airdrop`: Hooks used to either query airdrop info or mutate them
    - `token`: Hooks used to get tokens information from the solana cluster
  - `pages`: Standalone pages. There's currently 3 pages and the 404 page
  - `services`: Functions used to call the APIs and retrieve or mutate data
    - `api`: Contains airdrop and token related functions
    - `blockchain`: Contains functions used to interact with the blockchain and streamflow sdk
  - `types`: Types use accross the app. Airdrop and Tokey types are mostly generate from the return values of the services
  - `utils`: Utility functions use across the app.

## 🛡️ &nbsp; Proxy Server Architecture

Due to how the streamflow api handles requests, their server rejects requests from other domains so we use a proxy server to call most of the api endponts. See [Airdrop Service](/src/services/api/airdropService.ts) and [Token Service](/src/services/api/tokenService.ts).

<p align="center">
  <img src="./streamflow-architecture.svg" alt="Streamflow Architecture" width="700">
</p>

## 📚 &nbsp; Learn More

- Stream Flow

  - [App Docs](https://docs.streamflow.finance/)
  - [API Docs](https://api-public.streamflow.finance/v2/docs#tag/airdrops)
  - [Javascript/Typescript SDK Github](https://github.com/streamflow-finance/js-sdk)
  - [Javascript/Typescript SDK Docs](https://js-sdk-docs.streamflow.finance/)
  - [Airdrop Automation Guide](https://streamflow.notion.site/Public-Automated-Airdrop-Creation-45b84bfd2dda4d7196be5dd02eed29c8)

- Solana
  - [Rpc Methods](https://solana.com/docs/rpc)

## Improvements
- [ ] Better UI
- [ ] Use streamflow public apis and sdk rather than proxy


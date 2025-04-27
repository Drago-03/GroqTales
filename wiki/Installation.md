# Installation Guide

This guide will help you set up GroqTales for local development or personal use. Follow the steps below to get started.

## Prerequisites

Before installing GroqTales, ensure you have the following installed on your system:

- **Node.js** (version 16.x or higher) and **npm** or **yarn** for dependency management.
- **Git** for cloning the repository.
- A compatible web browser (e.g., Chrome, Firefox) with a cryptocurrency wallet extension like MetaMask (optional, for NFT features).

## Step 1: Clone the Repository

Clone the GroqTales repository to your local machine using Git:

```bash
git clone https://github.com/Drago-03/GroqTales.git
cd groqtales
```

## Step 2: Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
npm install
# or
yarn install
```

## Step 3: Set Up Environment Variables

GroqTales uses environment variables to manage sensitive information and configuration settings. Copy the example environment file to create your local configuration:

```bash
cp .env.example .env.local
```

Open `.env.local` in a text editor and replace the placeholder values with your actual credentials or mock values for development. **Do not commit `.env.local` to version control.**

Key variables to configure include:
- API keys for AI services (e.g., Groq).
- Blockchain network settings (e.g., Monad RPC URL).
- WalletConnect project ID for wallet integration.

Refer to the [Environment Variables Guide](Environment-Variables.md) for detailed information on each variable.

## Step 4: Run the Development Server

Start the Next.js development server to run GroqTales locally:

```bash
npm run dev
# or
yarn dev
```

Once the server starts, open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the GroqTales application running.

## Step 5: Connect a Wallet (Optional)

If you plan to use NFT minting features, ensure you have a cryptocurrency wallet like MetaMask installed in your browser. Follow the in-app instructions to connect your wallet to GroqTales.

## Troubleshooting

- **Node.js Version Issues**: Ensure you're using a compatible Node.js version. Use a tool like `nvm` to manage multiple Node.js versions if needed.
- **Dependency Errors**: If you encounter errors during `npm install`, try clearing the `node_modules` directory and `package-lock.json` file, then reinstall.
- **Environment Variables**: Double-check that all required environment variables are set correctly in `.env.local`.

If you encounter persistent issues, check the [FAQ](../FAQ.md) or reach out to the community via [GitHub Discussions](https://github.com/Drago-03/GroqTales/discussions).

## Next Steps

After installation, explore the [Quick Start Guide](Quick-Start-Guide.md) to create your first story, or dive into the [Development Setup](Development-Setup.md) for advanced customization and contribution.

Return to the [Home](../Home.md) page for more resources. 
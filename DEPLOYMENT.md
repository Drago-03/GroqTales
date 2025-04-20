# GroqTales Deployment Guide

This document provides instructions for deploying the GroqTales application to Vercel.

## Prerequisites

- A Vercel account (https://vercel.com)
- Git repository with your GroqTales code
- Access to all required API keys and environment variables

## Environment Variables

Set up the following environment variables in your Vercel project settings:

### Required Variables

- `NEXT_PUBLIC_GROQ_API_KEY`: Your Groq API key
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB_NAME`: MongoDB database name

### Recommended Variables

- `NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID`: Infura IPFS project ID
- `NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET`: Infura IPFS project secret
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID
- `MONAD_RPC_URL`: Monad RPC URL (defaults to `https://rpc.testnet.monad.xyz/json-rpc`)
- `MINTER_PRIVATE_KEY`: Private key for NFT minting (ensure this is securely stored)

## Database Setup

Before your first deployment, ensure your MongoDB database is properly initialized:

1. Run the database setup script locally:
   ```
   npm run setup-db
   ```
2. Verify the database collections and indexes were created

## Fixed Dependencies

We've updated the project to use Lucide React icons instead of Heroicons to resolve build issues. The following dependencies have been updated:

- `@radix-ui/react-tooltip`: Fixed to version 1.0.7
- Replaced `@heroicons/react` imports with `lucide-react` equivalents

## Deployment Steps

1. **Connect Your Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GroqTales repository
   
2. **Configure Project**:
   - Select the "Next.js" framework preset
   - Set the Environment Variables as listed above
   - Set the build command to: `npm run build`
   - Set the output directory to: `.next`
   
3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   
4. **Verify Deployment**:
   - Check the deployment logs for any errors
   - Test your application's functionality
   - Ensure all API integrations are working
   
## Troubleshooting

- **Build Errors**: Check the build logs on Vercel for specific errors
- **Missing Dependencies**: If you see errors about missing dependencies, make sure the package.json includes all necessary packages 
- **API Integration Issues**: Verify environment variables and check if all APIs are accessible from Vercel
- **Database Connection Issues**: Ensure your MongoDB URI is correctly formatted and the IP is whitelisted

## Production Considerations

- Enable Vercel Analytics for monitoring
- Set up custom domains if needed
- Configure Vercel's IP Access Restrictions for enhanced security
- Consider setting up preview deployments for pull requests

## Continuous Deployment

Vercel automatically deploys when changes are pushed to your repository. To customize this behavior:

1. Go to your project settings
2. Under "Git" tab, configure the branches for production and preview deployments
3. Set up deployment protection if needed 
# GroqTales
Groq-Powered NFT Story Generator on Monad

## Environment Setup

### API Keys and Environment Variables

This project requires several API keys and configuration variables to function properly. Follow these steps to set up your environment:

1. Copy the example environment file to create your local configuration:
   ```
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API keys and configuration values:
   - **Groq API Key**: Get a key from [Groq Console](https://console.groq.com/keys)
   - **MongoDB URI**: Your MongoDB connection string
   - **IPFS Configuration**: If using IPFS for storing content

3. **IMPORTANT: Never commit your `.env.local` file to version control!** This file contains sensitive API keys and credentials.

### Checking Environment Configuration

The project includes a script to verify your environment configuration:

```
npm run check-env
```

This will check if all required environment variables are properly set.

### API Key Security

- **Groq API Key**: This key should be kept secure. If your key is exposed:
  1. Immediately revoke the exposed key in the Groq Console
  2. Generate a new key
  3. Update your `.env.local` file with the new key
  4. If the key was accidentally committed, consider it compromised

## Development

To start the development server:

```
npm run dev
```

This will automatically check your environment configuration before starting the server.

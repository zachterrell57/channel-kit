# Channel Kit

Channel Kit is a Next.js application that provides a Farcaster Frame for managing channel memberships. It allows users to request membership to a Farcaster channel and verifies their eligibility based on various criteria.

## Features

- Farcaster Frame integration for channel membership requests
- User verification based on multiple criteria:
  - Power user status
  - Verified Ethereum address
  - Follower count
  - Casting activity in the channel
  - OpenRank profile ranking
  - STP (Subscription Token Protocol) subscription status
- Integration with Neynar API for Farcaster data
- OpenRank API integration for user engagement metrics
- STP integration for subscription verification

## Prerequisites

- Node.js (version specified in your package.json)
- Yarn or npm
- Neynar API key
- Farcaster developer mnemonic
- STP contract address and chain ID

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/channel-kit.git
   cd channel-kit
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Copy the `.dev.env.example` file to `.env.local` and fill in the required environment variables:
   ```
   cp .dev.env.example .env.local
   ```

4. Edit `.env.local` and add your specific values for:
   - `CHANNEL_ID`
   - `NEYNAR_API_KEY`
   - `SIGNER_UUID`
   - `FARCASTER_DEVELOPER_MNEMONIC`
   - `STP_CONTRACT_ADDRESS`
   - `STP_CHAIN_ID`

## Development

1. Run the development server:
   ```
   yarn dev
   ```

To run the development server:

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

To create a production build:
```
yarn build
```
## Deployment

This project is set up for deployment on Vercel. To deploy:
```
vercel deploy

## Project Structure

- `app/`: Next.js app directory
- `data/`: Data fetching functions for various APIs
- `lib/`: Utility functions and shared code
- `types/`: TypeScript type definitions
- `ui/`: UI components and styles
- `verifications/`: User verification logic

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your chosen license here]
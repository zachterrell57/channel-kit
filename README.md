# ChannelKit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ChannelKit is an open-source Next.js application built with [Frog.js](https://frog.fm) and deployed on [Vercel](https://vercel.com), providing a customizable Farcaster Frame for managing channel memberships. Designed for developers, it offers a flexible foundation for creating and managing membership requests to Farcaster channels.

## Prerequisites

- [Node.js] (v14 or later)
- [Yarn] package manager
- [Farcaster] account
- [Neynar] API key
- [Vercel] account
- [Vercel CLI]

[Node.js]: https://nodejs.org/
[Yarn]: https://yarnpkg.com/
[Farcaster]: https://www.farcaster.xyz/
[Neynar]: https://neynar.com/
[Vercel]: https://vercel.com/
[Vercel CLI]: https://vercel.com/docs/cli

## How it works

1. Channel owner deploys this project to Vercel
2. Channel owner casts frame in channel, optionally pins for better visibility
   TODO: Add image
3. Prespective member clicks "Request Membership" button on frame
4. Verifications run in background, and automatically output an accepted / denied state - If accepted, user is automatically sent an invite - If denied message is shown with reasoning
   ![CleanShot 2024-10-02 at 15 23 14@2x](https://github.com/user-attachments/assets/2c1d6cee-884a-4b0b-a414-62884a05267f)

## Getting Started

### 1. Clone or Fork the repository

- If you want to use the provided verification modules as-is:
  ```bash
  git clone https://github.com/yourusername/channel-kit.git
  cd channel-kit
  ```
- If you want to add modules, customize extensively, or contribute to the codebase:
  1. Fork the repository on GitHub using this button:
     ![CleanShot 2024-10-02 at 14 46 50@2x](https://github.com/user-attachments/assets/8ed66f5b-de31-4532-afb4-16fb961b9d10)
  2. Clone your forked repository:
     ```bash
     git clone https://github.com/your-username/channel-kit.git
     cd channel-kit
     ```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Edit `.env.local` and provide values for:

```
CHANNEL_ID=your_channel_id
NEYNAR_API_KEY=your_neynar_api_key
SIGNER_UUID=your_signer_uuid
```

### 4. Run the development server

```bash
yarn dev
```

The application will be available at `http://localhost:3000/api/dev`.

## Verifications

ChannelKit comes with a set of basic verifications to determine user eligibility for channel membership. These verifications are modular and can be easily customized or extended.

### Included Verifications

- `isPowerUser`: Checks if the user has a power badge on Warpcast.
- `hasVerifiedEthAddress`: Verifies if the user has a verified Ethereum address.
- `hasMoreThan100Followers`: Checks if the user has more than 100 followers.
- `hasCastedMoreThan10Times`: Verifies if the user has cast more than 10 times in the channel (commented out by default).
- `hasProfileRankBelow200`: Checks if the user's OpenRank profile rank is below 200 (commented out by default).
- `isSubscribedWithSTP`: Verifies if the user is subscribed with STP (Subscription Token Protocol) (commented out by default).

### Adding Custom Verifications

Developers are encouraged to add their own custom verifications based on their specific requirements

Example of a custom verification:

```typescript
export const hasSpecificBadge: VerificationFunction = async (
  fid: number
): Promise<VerificationResult> => {
  // Implement your verification logic here
  return { success: true, message: "User has the specific badge" }
}
```

Then add it to the `verificationFunctions` array:

```typescript
const verificationFunctions: VerificationFunction[] = [
  // ... existing verifications
  hasSpecificBadge,
]
```

## Deploying to Vercel

When ready, we can deploy our application:

```bash
yarn run deploy
```

Add our environment variables and redeploy:

```bash
yarn run upload-env
```

Your project should now be live!

## Viewing your Frame

Let's first grab the URL of our Frame from the Vercel Dashboard:
<img width="1232" alt="image" src="https://github.com/user-attachments/assets/2b3b5927-1052-4c9f-baf1-3ba537915e93">


Alternatively, you can run this command and get the first alias:

```bash
yarn vercel inspect [deployment-url]
```

<img width="525" alt="image" src="https://github.com/user-attachments/assets/5cc3adb8-0824-48d1-bb41-1729fe4491e9">


Now we can head to the Warpcast frame validator and paste the URL to see our live Frame:
[https://warpcast.com/~/developers/frames](https://warpcast.com/~/developers/frames)

## Customization

- Modify the verification criteria in `verifications/index.ts`
- Adjust the UI components in the `ui/` directory
- Update the Frame logic in `app/api/[[...routes]]/route.tsx`

## UI

This project uses a combination of custom styles and [FrogUI](https://frog.fm/ui). Due to some idiosyncrasies (such as custom fonts) with
Frog.js, Hono, and NextJS, you might find that either custom styles or FrogUI works where the other doesn't. All custom styles can be found
in `ui/styles.ts`, and all FrogUI elements can be found in `ui/index.ts`

## Contributing

ChannelKit is intended to be a community project! Contributions are welcome following these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Appendix

### Understanding the Verification and Data Structure

1. Data Fetching (`data/farcaster.ts`):

   - This file contains functions for fetching data from the Farcaster API via Neynar.
   - It includes methods like `getChannelMembers()`, `getUser()`, and `getUserCasts()`.
   - These functions handle the raw API calls and return structured data.

2. Verification Logic (`verifications/farcaster.ts`):
   - This file contains the actual verification functions that use the data fetched from `data/farcaster.ts`.
   - Each verification function implements a specific check, such as `isPowerUser` or `hasMoreThan100Followers`.
   - These functions use the `VerificationFunction` type and return a `VerificationResult`.

This separation allows you to:

- Add new API calls in `data/farcaster.ts` without changing the verification logic.
- Create new verification functions in `verifications/farcaster/index.ts` that use existing or new data fetching methods.
- Easily extend the system with new data sources or verification providers by adding new files in the `data/` and `verifications/` directories.

When customizing:

1. If you need new data either from an API or onchain, add a function to `data/farcaster.ts`.
2. To create a new verification, add a function to `verifications/farcaster/index.ts` and use the data fetching functions as needed.
3. Add your new verification function to the `verificationFunctions` array in `verifications/index.ts` to include it in the verification process.

This modular approach allows you to easily extend and modify the verification system to suit your specific channel membership criteria.

## License

This project is licensed under the MIT License.

import {
  hasCastedMoreThan10Times,
  hasMoreThan100Followers,
  hasVerifiedEthAddress,
  hasVerifiedSolAddress,
  isFollowedByChannelOwner,
  isInAllowlist,
  isPowerUser,
} from "./farcaster";
import {
  hasIcebreakerCoinbaseVerified,
  hasIcebreakerHuman,
  hasIcebreakerQBuilder,
  hasIcebreakerVerified,
} from "./icebreaker";
import { hasProfileRankBelow200 } from "./openrank";
import { isSubscribedWithSTP } from "./stp";
import { isWorldcoinVerified } from "./worldcoin";

export type VerificationResult = {
  success: boolean;
  message?: string;
};

export type VerificationFunction = (fid: number) => Promise<VerificationResult>;

const verificationFunctions: VerificationFunction[] = [
  // Check if the user is considered a power user based on Warpcast power badges
  // isPowerUser,

  // Verify if the user has a verified Ethereum address
  hasVerifiedEthAddress,

  // Check if the user has a verified Solana address
  // hasVerifiedSolAddress,

  // Check if the user has more than 100 followers
  hasMoreThan100Followers,

  // Check if the user is followed by the channel owner
  // isFollowedByChannelOwner,

  // Check if the user has casted more than 10 times in the channel
  // hasCastedMoreThan10Times,

  // Verify if the user's profile rank is below 200 according to OpenRank
  // hasProfileRankBelow200,

  // Check if the user is subscribed with STP (Subscription Token Protocol)
  // isSubscribedWithSTP,

  // Check if the user is in the allowlist
  // isInAllowlist,

  // Check if the user is verified with Worldcoin
  // isWorldcoinVerified,
];

export async function verifyUser(fid: number): Promise<VerificationResult> {
  for (const fn of verificationFunctions) {
    const result = await fn(fid);
    if (!result.success) {
      return result; // Fail fast if any verification fails
    }
  }
  return { success: true }; // No message needed for success
}

/**
 * Used to compose verification functions and succeed if any of them succeed. Example usage:
 *
 * const verificationFunctions = [
 *   OR(
 *     hasMoreThan100Followers,
 *     hasCastedMoreThan10Times,
 *   )
 * ]
 */
function OR(...fns: VerificationFunction[]): VerificationFunction {
  return async (fid) => {
    let errorMessage: VerificationResult["message"];
    for (const fn of fns) {
      const result = await fn(fid);
      if (result.success) {
        return result;
      }
      errorMessage = result.message;
    }
    return { success: false, message: errorMessage };
  };
}

import {
  hasCastedMoreThan10Times,
  hasMoreThan100Followers,
  hasVerifiedEthAddress,
  isPowerUser,
} from "./farcaster"
import { hasProfileRankBelow200 } from "./openrank"
import { isSubscribedWithSTP } from "./stp"

export type VerificationResult = {
  success: boolean
  message?: string
}

export type VerificationFunction = (fid: number) => Promise<VerificationResult>

const verificationFunctions: VerificationFunction[] = [
  // Check if the user is considered a power user based on Warpcast power badges
  isPowerUser,

  // Verify if the user has a verified Ethereum address
  hasVerifiedEthAddress,

  // Check if the user has more than 100 followers
  hasMoreThan100Followers,

  // Check if the user has casted more than 10 times in the channel
  // hasCastedMoreThan10Times,

  // Verify if the user's profile rank is below 200 according to OpenRank
  // hasProfileRankBelow200,

  // Check if the user is subscribed with STP (Subscription Token Protocol)
  // isSubscribedWithSTP,
]

export async function verifyUser(fid: number): Promise<VerificationResult> {
  for (const fn of verificationFunctions) {
    const result = await fn(fid)
    if (!result.success) {
      return result // Fail fast if any verification fails
    }
  }
  return { success: true } // No message needed for success
}

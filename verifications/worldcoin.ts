import { useVerified } from "farcaster-humanizer";
import type { VerificationFunction, VerificationResult } from ".";

export const isWorldcoinVerified: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  try {
    const { isVerified } = useVerified();
    const verified = await isVerified(fid);

    if (verified) {
      return { success: true };
    }

    return { success: false, message: "User is not verified with Worldcoin" };
  } catch (error) {
    console.error("Error checking Worldcoin verification:", error);
    return {
      success: false,
      message: "Error checking Worldcoin verification status",
    };
  }
};

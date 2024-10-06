import { VerificationFunction, VerificationResult } from "."
import { getIcebreakerbyFid, hasCredential } from '@/data/icebreaker';

export const hasIcebreakerHuman: VerificationFunction = async (
  fid: number
): Promise<VerificationResult> => {
  const credential = "Human";

  const user = await getIcebreakerbyFid(fid);

  if (!user) {
    return {
      success: false,
      message: `${fid} not found in Icebreaker`,
    };
  }

  const userHasCredential = hasCredential(credential, user.credentials, true);

  return {
    success: userHasCredential,
    message: userHasCredential
      ? `${fid} has the ${credential} credential`
      : `${fid} does not have the ${credential} credential`,
  };
}

export const hasIcebreakerVerified: VerificationFunction = async (
  fid: number
  ): Promise<VerificationResult> => {
  const credential = "Verified:";

  const user = await getIcebreakerbyFid(fid);

  if (!user) {
    return {
      success: false,
      message: `${fid} not found in Icebreaker`,
    };
  }

  const userHasCredential = hasCredential(credential, user.credentials);

  return {
    success: userHasCredential,
    message: userHasCredential
      ? `${fid} has the ${credential} credential`
      : `${fid} does not have the ${credential} credential`,
  };
}

export const hasIcebreakerQBuilder: VerificationFunction = async (
  fid: number
  ): Promise<VerificationResult> => {
  const credential = "qBuilder";

  const user = await getIcebreakerbyFid(fid);

  if (!user) {
    return {
      success: false,
      message: `${fid} not found in Icebreaker`,
    };
  }

  const userHasCredential = hasCredential(credential, user.credentials, true);

  return {
    success: userHasCredential,
    message: userHasCredential
      ? `${fid} has the ${credential} credential`
      : `${fid} does not have the ${credential} credential`,
  };
}

// Sample verification function for a non Icebreaker credential. See icebreakerlabs/alloy repo for supported credentials.
export const hasIcebreakerCoinbaseVerified: VerificationFunction = async (
  fid: number
  ): Promise<VerificationResult> => {
  const credential = "Coinbase Verified";

  const user = await getIcebreakerbyFid(fid);

  if (!user) {
    return {
      success: false,
      message: `${fid} not found in Icebreaker`,
    };
  }

  const userHasCredential = hasCredential(credential, user.credentials);

  return {
    success: userHasCredential,
    message: userHasCredential
      ? `${fid} has the ${credential} credential`
      : `${fid} does not have the ${credential} credential`,
  };
}

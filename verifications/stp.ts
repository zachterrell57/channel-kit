import { getSTPStatus } from "@/data/stp";

import type { VerificationFunction, VerificationResult } from ".";

export const isSubscribedWithSTP: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  const subscription = await getSTPStatus(fid);

  if (subscription && Object.values(subscription).at(0)?.status) return { success: true };

  return {
    success: false,
    message: "User is not subscribed via STP",
  };
};

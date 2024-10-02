import { VerificationFunction, VerificationResult } from "..";
import * as openrank from "@/data/openrank";
export const hasProfileRankBelow200: VerificationFunction = async (
  fid: number
): Promise<VerificationResult> => {
  const profile = await openrank.getProfileEngagementRank(fid);
  return profile.rank < 100
    ? { success: true }
    : {
        success: false,
        message: `User has an openrank profile rank less than 200`,
      };
};

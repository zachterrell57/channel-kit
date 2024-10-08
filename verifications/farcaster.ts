import * as farcaster from "@/data/farcaster";

import type { VerificationFunction, VerificationResult } from ".";

export const isMemberOfChannel: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  const members = await farcaster.getChannelMembers();

  return { success: members.members.some((member) => member.user.fid === fid) };
};

export const isInvitedToChannel: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  return { success: true, message: "Not implemented" };
};

export const followsChannel: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  try {
    const response = await farcaster.getUserFollowingChannelStatus(fid);

    if (response.result.following) {
      return { success: true };
    }

    return { success: false, message: "User does not follow the channel" };
  } catch (error) {
    console.error("Error checking if user follows channel:", error);
    return { success: false, message: "Error checking channel follow status" };
  }
};

export const isPowerUser: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  const user = await farcaster.getUser(fid);
  return user.users[0].power_badge ? { success: true } : { success: false, message: "User is not a power user" };
};

export const hasMoreThan100Followers: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  const user = await farcaster.getUser(fid);
  const followerCount = user.users[0].follower_count;
  return followerCount > 100
    ? { success: true }
    : {
        success: false,
        message: "User has less than 100 followers",
      };
};

export const hasVerifiedEthAddress: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  const user = await farcaster.getUser(fid);
  const hasVerified = user.users[0].verified_addresses.eth_addresses.length > 0;
  return hasVerified
    ? { success: true }
    : {
        success: false,
        message: "User does not have a verified Ethereum address",
      };
};

export const hasVerifiedSolAddress: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  const user = await farcaster.getUser(fid);
  const hasVerified = user.users[0].verified_addresses.sol_addresses.length > 0;
  return hasVerified
    ? { success: true }
    : {
        success: false,
        message: "User does not have a verified Solana address",
      };
};

export const hasCastedMoreThan10Times: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  const casts = await farcaster.getUserCasts(fid);
  return casts.length > 10
    ? { success: true }
    : {
        success: false,
        message: "User has casted less than 10 times in this channel",
      };
};

const ALLOWED_FIDS = [1, 2, 3];

export const isInAllowlist: VerificationFunction = async (fid: number): Promise<VerificationResult> => {
  if (ALLOWED_FIDS.includes(fid)) {
    return { success: true };
  }

  return { success: false, message: "User is not in the allowlist" };
};

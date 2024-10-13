import { env } from "@/env";
import neynarClient from "@/lib/neynar";
import { makeWarpcastRequest } from "@/lib/warpcast";

export async function getChannelMembers(fid: number) {
  const { members } = await neynarClient.fetchChannelMembers(env.CHANNEL_ID, { fid });
  return members;
}

export type UserChannelStatusResponse = {
  result: {
    following: boolean;
    followedAt?: number;
  };
};

export async function getUserFollowingChannelStatus(fid: number): Promise<UserChannelStatusResponse> {
  const url = "https://api.warpcast.com/v1/user-channel";
  const queryParams: Record<string, string> = {
    fid: fid.toString(),
    channelId: env.CHANNEL_ID,
  };

  const response = await makeWarpcastRequest({
    url,
    method: "GET",
    queryParams,
  });

  return response as UserChannelStatusResponse;
}

export async function getChannelDetails() {
  const { channel } = await neynarClient.lookupChannel(env.CHANNEL_ID);

  return channel;
}

export async function getUser(fid: number, viewerFid?: number) {
  const { users } = await neynarClient.fetchBulkUsers([fid], viewerFid ? { viewerFid } : undefined);

  return users.at(0);
}

export async function isInvitedToChannel(fid: number) {
  const { invites } = await neynarClient.fetchChannelInvites({channelId: env.CHANNEL_ID, invitedFid: fid});

  return { success: invites.some((invite) => invite.invited.fid === fid) };
}

export async function sendChannelInvite(fid: number) {
  const { success } = await neynarClient.inviteChannelMember(env.SIGNER_UUID, env.CHANNEL_ID, fid, "member");

  return !!success;
}

export async function getUserCasts(fid: number) {
  const { casts } = await neynarClient.fetchCastsForUser(fid, { channelId: env.CHANNEL_ID });

  return casts;
}

export type AccountVerification = {
  fid: number;
  platform: string;
  platformUsername: string;
  verifiedAt: number;
};

export type AccountVerificationsResponse = {
  result: {
    verifications: AccountVerification[];
  };
  next?: { cursor: string };
};

export async function getAccountVerifications(fid?: number): Promise<AccountVerificationsResponse> {
  const url = "https://api.warpcast.com/fc/account-verifications";
  const queryParams: Record<string, string> = {};

  if (fid) {
    queryParams.fid = fid.toString();
  }

  const response = await makeWarpcastRequest({
    url,
    method: "GET",
    queryParams,
  });

  return response as AccountVerificationsResponse;
}

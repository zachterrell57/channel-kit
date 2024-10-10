import { env } from "@/env";
import neynarClient from "@/lib/neynar";
import { makeWarpcastRequest } from "@/lib/warpcast";
import { ChannelMemberRole } from "@neynar/nodejs-sdk/build/neynar-api/v2/index";

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

export async function sendChannelInvite(fid: number) {
  const { success } = await neynarClient.inviteChannelMember(
    env.SIGNER_UUID,
    env.CHANNEL_ID,
    fid,
    ChannelMemberRole.Member
  );

  return !!success;
}

export async function getUserCasts(fid: number) {
  const { casts } = await neynarClient.fetchCastsForUser(fid, { channelId: env.CHANNEL_ID });

  return casts;
}

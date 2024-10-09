import { CHANNEL_ID, SIGNER_UUID } from "@/env";
import type { Cast, ChannelMetadata, Member, User } from "@/types";

import { makeNeynarRequest } from "@/lib/neynar";
import { makeWarpcastRequest } from "@/lib/warpcast";

export type MembersResponse = {
  members: Member[];
};
export async function getChannelMembers(fid: number): Promise<MembersResponse> {
  const url = "https://api.neynar.com/v2/farcaster/channel/member/list";
  const response = await makeNeynarRequest({
    url,
    method: "GET",
    queryParams: { channel_id: CHANNEL_ID, fid: fid.toString() },
  });

  return response as MembersResponse;
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
    channelId: CHANNEL_ID,
  };

  const response = await makeWarpcastRequest({
    url,
    method: "GET",
    queryParams,
  });

  return response as UserChannelStatusResponse;
}

export async function getChannelDetails(): Promise<ChannelMetadata> {
  const url = "https://api.neynar.com/v2/farcaster/channel";
  const response = await makeNeynarRequest({
    url,
    method: "GET",
    queryParams: { id: CHANNEL_ID },
  });

  return response.channel as ChannelMetadata;
}

export type UsersResponse = {
  users: User[];
};
export async function getUser(fid: number, viewerFid?: number): Promise<UsersResponse> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}${viewerFid ? `&viewer_fid=${viewerFid}` : ""}`;

  const response = await makeNeynarRequest({
    url,
    method: "GET",
  });

  return response as UsersResponse;
}

export async function sendChannelInvite(fid: number): Promise<boolean> {
  const url = "https://api.neynar.com/v2/farcaster/channel/member/invite";

  const data = {
    signer_uuid: SIGNER_UUID,
    channel_id: CHANNEL_ID,
    fid,
    role: "member",
  };

  return makeNeynarRequest({ url, method: "POST", data });
}

export async function getUserCasts(fid: number): Promise<Cast[]> {
  const url = "https://api.neynar.com/v2/farcaster/feed/user/casts";
  const response = await makeNeynarRequest({
    url,
    method: "GET",
    queryParams: {
      fid: fid.toString(),
      channel_id: CHANNEL_ID,
    },
  });

  return response.casts as Cast[];
}

import { env } from "@/env";

import neynarClient from "@/lib/neynar";

import { getUser } from "./farcaster";

export async function getSTPStatus(fid: number) {
  const user = await getUser(fid);
  const address = user?.verified_addresses.eth_addresses[0];

  if (!address) return null;

  // TODO: handle multiple addresses

  return neynarClient.fetchSubscriptionCheck([address], env.STP_CONTRACT_ADDRESS, env.STP_CHAIN_ID);
}

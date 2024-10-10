import { STP_CHAIN_ID, STP_CONTRACT_ADDRESS } from "@/env";

import neynarClient from "@/lib/neynar";

import { getUser } from "./farcaster";

export async function getSTPStatus(fid: number) {
  const user = await getUser(fid);
  const address = user?.verified_addresses.eth_addresses[0];

  if (!address) return null;

  // TODO: handle multiple addresses

  return neynarClient.fetchSubscriptionCheck([address], STP_CONTRACT_ADDRESS, STP_CHAIN_ID);
}

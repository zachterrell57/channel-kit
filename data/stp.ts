import { STP_CHAIN_ID, STP_CONTRACT_ADDRESS } from "@/env"

import { makeNeynarRequest } from "@/lib/neynar"

import { getUser } from "./farcaster"

export type SubscriptionResponse = {
  [address: string]: {
    object: string
    status: boolean
    expires_at: number
    subscribed_at: number
    tier: {
      id: number
      price: {
        period_duration_seconds: number
        tokens_per_period: string
        initial_mint_price: string
      }
    }
  }
}

export async function getSTPStatus(fid: number): Promise<SubscriptionResponse> {
  const user = await getUser(fid)

  const address = user.users[0].verified_addresses.eth_addresses[0]

  //   TODO: handle multiple addresses
  //   TODO: handle no addresses

  const url = "https://api.neynar.com/v2/stp/subscription_check"
  const response = await makeNeynarRequest({
    url,
    method: "GET",
    queryParams: {
      addresses: address,
      contract_address: STP_CONTRACT_ADDRESS,
      chain_id: STP_CHAIN_ID,
    },
  })

  return response as SubscriptionResponse
}

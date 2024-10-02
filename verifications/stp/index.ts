import { getSTPStatus } from "@/data/stp"

import { VerificationFunction, VerificationResult } from ".."

export const isSubscribedWithSTP: VerificationFunction = async (
  fid: number
): Promise<VerificationResult> => {
  const subscription = await getSTPStatus(fid)

  const firstAddress = Object.keys(subscription)[0]
  console.log(subscription[firstAddress])
  return subscription[firstAddress].status
    ? { success: true }
    : {
        success: false,
        message: `User is not subscribed via STP`,
      }
}

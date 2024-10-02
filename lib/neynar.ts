import { NEYNAR_API_KEY } from "@/env"
import { NeynarAPIClient } from "@neynar/nodejs-sdk"

let neynarClient: NeynarAPIClient

if (NEYNAR_API_KEY) {
  neynarClient = new NeynarAPIClient(NEYNAR_API_KEY)
} else {
  console.warn(
    "NEYNAR_API_KEY is not set in the .env file. Using default client."
  )
  neynarClient = new NeynarAPIClient("NEYNAR_API_KEY_NOT_SET")
}

export default neynarClient

type NeynarRequestOptions = {
  url: string
  method: "GET" | "POST"
  queryParams?: Record<string, string>
  data?: any
}

export async function makeNeynarRequest({
  url,
  method,
  queryParams,
  data,
}: NeynarRequestOptions): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      accept: "application/json",
      api_key: NEYNAR_API_KEY,
      "content-type": "application/json",
    },
  }

  if (queryParams) {
    const searchParams = new URLSearchParams(queryParams)
    url += `?${searchParams.toString()}`
  }

  if (method === "POST" && data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Neynar API error:", error)
    throw error
  }
}

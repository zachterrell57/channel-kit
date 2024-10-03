import type { Metadata } from "next"
import { getFrameMetadata } from "frog/next"

export async function generateMetadata(): Promise<Metadata> {
  const url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost:3000"}`
  const frameMetadata = await getFrameMetadata(`${url}/api`)
  return {
    other: frameMetadata,
  }
}

export default function Home() {
  return <></>
}

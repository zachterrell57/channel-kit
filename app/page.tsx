import type { Metadata } from "next"
import { getFrameMetadata } from "frog/next"

export async function generateMetadata(): Promise<Metadata> {
  const url = process.env.VERCEL_URL || "http://localhost:3000"
  const frameMetadata = await getFrameMetadata(`${url}/api`)
  return {
    other: frameMetadata,
  }
}

export default function Home() {
  return <></>
}

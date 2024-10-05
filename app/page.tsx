import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";
  const frameMetadata = await getFrameMetadata(`${url}/api`);
  return {
    other: frameMetadata,
  };
}

export default function Home() {
  return <></>;
}

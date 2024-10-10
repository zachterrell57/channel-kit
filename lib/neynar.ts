import { NEYNAR_API_KEY } from "@/env";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

let neynarClient: NeynarAPIClient;

if (NEYNAR_API_KEY) {
  neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);
} else {
  console.warn("NEYNAR_API_KEY is not set in the .env file. Using default client.");
  neynarClient = new NeynarAPIClient("NEYNAR_API_KEY_NOT_SET");
}

export default neynarClient;

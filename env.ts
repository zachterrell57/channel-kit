import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CHANNEL_ID: z.string().optional().default(""),
    NEYNAR_API_KEY: z.string().optional().default(""),
    SIGNER_UUID: z.string().uuid().optional().default(""),
    STP_CONTRACT_ADDRESS: z.string().optional().default(""),
    STP_CHAIN_ID: z.string().optional().default(""),
  },
  experimental__runtimeEnv: {},
});

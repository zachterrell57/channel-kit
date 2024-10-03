import fs from "fs"
import { ViemLocalEip712Signer } from "@farcaster/hub-nodejs"
import { NeynarAPIClient } from "@neynar/nodejs-sdk"
import dotenv from "dotenv"
import qrcodeTerminal from "qrcode-terminal"
import { bytesToHex, hexToBytes } from "viem"
import { mnemonicToAccount } from "viem/accounts"

dotenv.config({ path: ".env.local" })

const { NEYNAR_API_KEY, FARCASTER_MNEMONIC } = process.env

if (!NEYNAR_API_KEY || !FARCASTER_MNEMONIC) {
  throw new Error(
    "Please set NEYNAR_API_KEY and FARCASTER_MNEMONIC in your .env file"
  )
}

const farcasterMnemonic = FARCASTER_MNEMONIC as string
const neynarApiKey = NEYNAR_API_KEY as string

const neynarClient = new NeynarAPIClient(neynarApiKey)

async function getFid() {
  const account = mnemonicToAccount(farcasterMnemonic)
  const { user: farcasterDeveloper } =
    await neynarClient.lookupUserByCustodyAddress(account.address)
  return Number(farcasterDeveloper.fid)
}

async function generateSignature(publicKey: string) {
  const account = mnemonicToAccount(farcasterMnemonic)
  const appAccountKey = new ViemLocalEip712Signer(account as any)
  const deadline = Math.floor(Date.now() / 1000) + 86400
  const uintAddress = hexToBytes(publicKey as `0x${string}`)
  const FID = await getFid()

  const signature = await appAccountKey.signKeyRequest({
    requestFid: BigInt(FID),
    key: uintAddress,
    deadline: BigInt(deadline),
  })

  if (signature.isErr()) {
    throw new Error("Failed to generate signature")
  }

  const sigHex = bytesToHex(signature.value)
  return { deadline, signature: sigHex }
}

async function pollSignerStatus(signerUuid: string) {
  console.log("Waiting for signer approval...")
  const pollInterval = setInterval(async () => {
    try {
      const signer = await neynarClient.lookupSigner(signerUuid)
      if (signer.status === "approved") {
        clearInterval(pollInterval)
        console.log("Signer approved!")

        // Read the current contents of .env.local
        let envContent = fs.readFileSync(".env.local", "utf8")

        // Replace the SIGNER_UUID line or add it if it doesn't exist
        const signerUuidRegex = /^SIGNER_UUID=.*$/m
        if (signerUuidRegex.test(envContent)) {
          envContent = envContent.replace(
            signerUuidRegex,
            `SIGNER_UUID=${signerUuid}`
          )
        } else {
          envContent += `\nSIGNER_UUID=${signerUuid}`
        }

        // Write the updated content back to .env.local
        fs.writeFileSync(".env.local", envContent)
        console.log("Signer UUID updated in .env.local file")

        process.exit(0)
      }
    } catch (error) {
      console.error("Error during polling:", error)
    }
  }, 2000)
}

async function createSigner() {
  try {
    const createSigner = await neynarClient.createSigner()
    const { deadline, signature } = await generateSignature(
      createSigner.public_key
    )
    const fid = await getFid()

    const signedKey = await neynarClient.registerSignedKey(
      createSigner.signer_uuid,
      fid,
      deadline,
      signature
    )

    console.log(
      "Signer created successfully. Please copy this UUID in case the approval fails: ",
      signedKey.signer_uuid
    )

    console.log("\nScan this QR code to approve the signer:")
    qrcodeTerminal.generate(signedKey.signer_approval_url!, { small: true })
    console.log("\nOr open this URL on your mobile device:")
    console.log(signedKey.signer_approval_url)

    await pollSignerStatus(createSigner.signer_uuid)
  } catch (error) {
    console.error("Error creating signer:", error)
  }
}

createSigner()

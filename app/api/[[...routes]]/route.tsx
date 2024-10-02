/** @jsxImportSource frog/jsx */

import { Button, Frog } from "frog";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { NEYNAR_API_KEY } from "@/env";
import { verifyUser } from "@/verifications";
import { getChannelDetails, sendChannelInvite } from "@/data/farcaster";

import {
  isInvitedToChannel,
  isMemberOfChannel,
} from "@/verifications/farcaster";

import {
  icon,
  container,
  title as titleStyles,
  verticalStack,
  messageBox,
  messageText,
  channelInfo,
} from "@/ui/styles";
import { Icon, vars } from "@/ui";

function SuccessImage({ title, message }: { title: string; message: string }) {
  return (
    <div style={{ ...container }}>
      <div style={{ ...verticalStack }}>
        <div style={{ ...channelInfo }}>
          <Icon name="user-check" color="green700" size="44" />
          <p style={{ ...titleStyles }}>{title}</p>
        </div>
        <div style={{ ...messageBox }}>
          <div style={{ ...messageText }}>{message}</div>
        </div>
      </div>
    </div>
  );
}

function FailureImage({ title, message }: { title: string; message: string }) {
  return (
    <div style={{ ...container }}>
      <div style={{ ...verticalStack }}>
        <div style={{ ...channelInfo }}>
          <Icon name="circle-x" color="red700" size="44" />
          <p style={{ ...titleStyles }}>{title}</p>
        </div>
        <div style={{ ...messageBox }}>
          <div style={{ ...messageText }}>{message}</div>
        </div>
      </div>
    </div>
  );
}

export const app = new Frog({
  basePath: "/api",
  title: "Channel Membership Request",
  hub: neynar({ apiKey: NEYNAR_API_KEY }),
  // imageOptions: async () => ({ fonts: [await getFont()] }), // I'm going to kill myself
  ui: { vars },
});

// Initial frame
app.frame("/", async (c) => {
  const channelMetadata = await getChannelDetails();

  return c.res({
    image: (
      <div style={{ ...container }}>
        <div style={{ ...verticalStack }}>
          <div style={{ ...channelInfo }}>
            <img style={{ ...icon }} src={channelMetadata.image_url} />
            <p style={{ ...titleStyles }}>Join /{channelMetadata.name}</p>
          </div>
          <div style={{ ...messageBox }}>
            <div style={{ ...messageText }}>
              To join the channel, please click the button below to request a
              membership
            </div>
          </div>
        </div>
      </div>
    ),
    intents: [<Button value="request">Request Membership</Button>],
    action: "/request",
  });
});

// Request frame
app.frame("/request", async (c) => {
  const { verified, frameData } = c;

  if (!frameData) {
    throw new Error("Missing frame data");
  }

  if (process.env.NODE_ENV !== "development" && !verified) {
    throw new Error("Missing verification");
  }

  const fid = frameData.fid;

  try {
    // if ((await isMemberOfChannel(fid)).success) {
    //   return c.res({
    //     image: (
    //       <FailureImage
    //         title="Already a Member"
    //         message="You are already a member of the channel"
    //       />
    //     ),
    //     intents: [<Button.Reset>Done</Button.Reset>],
    //   });
    // }

    // if ((await isInvitedToChannel(fid)).success) {
    //   return c.res({
    //     image: (
    //       <SuccessImage
    //         title="Invite Sent"
    //         message="Open the notifications tab to accept your invite"
    //       />
    //     ),
    //     intents: [<Button.Reset>Done</Button.Reset>],
    //   });
    // }

    const verificationResult = await verifyUser(fid);

    if (verificationResult.success) {
      const invited = await sendChannelInvite(fid);

      if (invited) {
        return c.res({
          image: (
            <SuccessImage
              title="Invite Sent"
              message="Open the notifications tab to accept your invite"
            />
          ),
          intents: [<Button.Reset>Done</Button.Reset>],
        });
      } else {
        return c.res({
          image: (
            <FailureImage title="Invite Failed" message="Please try again" />
          ),
          intents: [<Button.Reset>Done</Button.Reset>],
        });
      }
    } else {
      return c.res({
        image: (
          <FailureImage
            title="Membership Request Failed"
            message={verificationResult.message || ""}
          />
        ),
        intents: [<Button.Reset>Done</Button.Reset>],
      });
    }
  } catch (error) {
    return c.res({
      image: (
        <FailureImage
          title="Error"
          message={error instanceof Error ? error.message : "Unknown error"}
        />
      ),
      intents: [<Button.Reset>Try Again</Button.Reset>],
    });
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

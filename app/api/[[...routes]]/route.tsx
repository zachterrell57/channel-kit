/** @jsxImportSource frog/jsx */
import { NEYNAR_API_KEY } from "@/env";
import { Heading, Icon, vars } from "@/ui";
import { verifyUser } from "@/verifications";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

import { getChannelDetails, sendChannelInvite } from "@/data/farcaster";
import { channelInfo, container, icon, messageBox, messageText, verticalStack } from "@/ui/styles";
import { followsChannel, isMemberOfChannel } from "@/verifications/farcaster";

const app = new Frog({
  basePath: "/api",
  title: "ChannelKit",
  hub: neynar({ apiKey: NEYNAR_API_KEY }),
  ui: { vars },
});

function SuccessImage({ title, message }: { title: string; message: string }) {
  return (
    <div style={{ ...container }}>
      <div style={{ ...verticalStack }}>
        <div style={{ ...channelInfo }}>
          <Icon name="user-check" color="green700" size="52" />
          <div style={{ paddingTop: 8, display: "flex" }}>
            <Heading size="42" font={"default"} weight="600">
              {title}
            </Heading>
          </div>
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
          <Icon name="circle-x" color="red700" size="52" />
          <div style={{ paddingTop: 8, display: "flex" }}>
            <Heading size="42" font={"default"} weight="600">
              {title}
            </Heading>
          </div>
        </div>
        <div style={{ ...messageBox }}>
          <div style={{ ...messageText }}>{message}</div>
        </div>
      </div>
    </div>
  );
}

// Initial frame
app.frame("/", async (c) => {
  const channelMetadata = await getChannelDetails();

  return c.res({
    image: (
      <div style={{ ...container }}>
        <div style={{ ...verticalStack }}>
          <div style={{ ...channelInfo }}>
            <img style={{ ...icon }} src={channelMetadata.image_url} alt="Channel Logo" />
            <div style={{ paddingTop: 10, display: "flex" }}>
              <Heading size="42" font={"default"} weight="600">
                Join /{channelMetadata.name}
              </Heading>
            </div>
          </div>
          <div style={{ ...messageBox }}>
            <div style={{ ...messageText }}>
              To join the channel, please click the button below to request a membership
            </div>
          </div>
        </div>
      </div>
    ),
    intents: <Button value="request">Request Membership</Button>,
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
    if ((await isMemberOfChannel(fid)).success) {
      return c.res({
        image: <FailureImage title="Already a Member" message="You are already a member of the channel" />,
        intents: <Button.Reset>Done</Button.Reset>,
      });
    }

    // TODO: Waiting on Neynar API
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

    if (!(await followsChannel(fid)).success) {
      return c.res({
        image: <FailureImage title="Not Following Channel" message="Follow the channel and then try again" />,
        intents: <Button.Reset>Try Again</Button.Reset>,
      });
    }

    const verificationResult = await verifyUser(fid);

    if (verificationResult.success) {
      const invited = await sendChannelInvite(fid);

      if (invited) {
        return c.res({
          image: <SuccessImage title="Invite Sent" message="Open the notifications tab to accept your invite" />,
          intents: <Button.Reset>Done</Button.Reset>,
        });
      }

      return c.res({
        image: <FailureImage title="Invite Failed" message="Please try again" />,
        intents: <Button.Reset>Done</Button.Reset>,
      });
    }

    return c.res({
      image: <FailureImage title="Request Denied" message={verificationResult.message || ""} />,
      intents: <Button.Reset>Done</Button.Reset>,
    });
  } catch (error) {
    return c.res({
      image: (
        <FailureImage
          title="Error"
          message={error instanceof Error ? `Error: ${error.name} - ${error.message}` : "Unknown error"}
        />
      ),
      intents: <Button.Reset>Try Again</Button.Reset>,
    });
  }
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

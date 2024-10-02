import { CSSProperties } from "hono/jsx";

export const container: CSSProperties = {
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  backgroundColor: "#17101F",
  fontFamily: "Inter",
};

export const verticalStack: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export const channelInfo: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 32,
  height: "50%",
  paddingLeft: 128,
  paddingRight: 128,
};

export const icon: CSSProperties = {
  borderRadius: "50%",
  width: 96,
  height: 96,
};

export const title: CSSProperties = {
  fontSize: 48,
  fontFamily: "inter",
  fontWeight: "600",
  paddingTop: 8,
  color: "#FFFFFF",
};

export const messageBox: CSSProperties = {
  display: "flex",
  backgroundColor: "#1F1827",
  alignItems: "center",
  justifyContent: "center",
  height: "50%",
  width: "100%",
};

export const messageText: CSSProperties = {
  display: "flex",
  width: "100%",
  color: "#9FA3AF",
  fontSize: 32,
  paddingLeft: 128,
  paddingRight: 128,
};

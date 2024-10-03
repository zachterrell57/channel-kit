import { CSSProperties } from "hono/jsx"

export const container: CSSProperties = {
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  backgroundColor: "#17101F",
  fontFamily: "Inter",
}

export const verticalStack: CSSProperties = {
  display: "flex",
  flexDirection: "column",
}

export const channelInfo: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 32,
  height: "50%",
  paddingLeft: 80,
  paddingRight: 80,
}

export const icon: CSSProperties = {
  borderRadius: "50%",
  width: 128,
  height: 128,
}

export const messageBox: CSSProperties = {
  display: "flex",
  backgroundColor: "#1F1827",
  alignItems: "center",
  justifyContent: "center",
  height: "50%",
  width: "100%",
}

export const messageText: CSSProperties = {
  display: "flex",
  width: "100%",
  color: "#9FA3AF",
  fontSize: 40,
  paddingLeft: 80,
  paddingRight: 80,
}

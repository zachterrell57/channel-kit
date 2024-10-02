import { createSystem } from "frog/ui"

export const { Icon, Heading, vars } = createSystem({
  fonts: {
    default: [
      {
        name: "Inter",
        source: "google",
        weight: 400,
      },
      {
        name: "Inter",
        source: "google",
        weight: 600,
      },
    ],
  },
})

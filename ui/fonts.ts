import { NEXT_PUBLIC_APP_URL } from "@/env";

declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
declare type Style = "normal" | "italic";

export interface Font {
  data: Buffer | ArrayBuffer;
  name: string;
  weight?: Weight;
  style?: Style;
  lang?: string;
}

export async function getFont() {
  let fontData: ArrayBuffer;

  try {
    fontData = await fetch(
      new URL(`${NEXT_PUBLIC_APP_URL}/inter.ttf`, import.meta.url)
    ).then((res) => res.arrayBuffer());
  } catch (error) {
    console.error("Error loading font:", error);
    throw error;
  }

  return { name: "inter", data: fontData, style: "normal" } satisfies Font;
}

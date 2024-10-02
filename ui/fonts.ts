declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
declare type Style = "normal" | "italic";

export interface Font {
  data: Buffer | ArrayBuffer;
  name: string;
  weight?: Weight;
  style?: Style;
  lang?: string;
}

export async function getFont(font: "inter" | "inter-bold") {
  let fontData: ArrayBuffer;

  const baseUrl =
    "https://github.com/zachterrell57/channel-kit/blob/main/assets/";

  if (font === "inter-bold") {
    fontData = await fetchFont(`${baseUrl}/Inter-Bold.ttf`);
  } else {
    fontData = await fetchFont(`${baseUrl}/Inter-Regular.ttf`);
  }

  return { name: "inter", data: fontData, style: "normal" } satisfies Font;
}

async function fetchFont(url: string) {
  const res = await fetch(url, { cache: "force-cache" });
  return res.arrayBuffer();
}

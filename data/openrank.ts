type OpenrankRequestOptions = {
  url: string;
  method: "GET" | "POST";
  queryParams?: Record<string, string>;
  data?: any;
};

export async function makeOpenrankRequest({ url, method, queryParams, data }: OpenrankRequestOptions): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (queryParams) {
    const searchParams = new URLSearchParams(queryParams);
    url += `?${searchParams.toString()}`;
  }

  if (method === "POST" && data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error - status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("OpenRank API error:", error);
    throw error;
  }
}

export type ProfileEngagementRank = {
  fid: number;
  username: string;
  rank: number;
  score: number;
  percentile: number;
};

export async function getProfileEngagementRank(fid: number): Promise<ProfileEngagementRank> {
  const url = "https://graph.cast.k3l.io/scores/global/engagement/fids";
  const response = await makeOpenrankRequest({
    url,
    method: "POST",
    data: [fid],
  });

  console.log("response", response);
  return response.result[0] as ProfileEngagementRank;
}

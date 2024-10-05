import { NEYNAR_API_KEY } from "@/env";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

let neynarClient: NeynarAPIClient;

if (NEYNAR_API_KEY) {
  neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);
} else {
  console.warn("NEYNAR_API_KEY is not set in the .env file. Using default client.");
  neynarClient = new NeynarAPIClient("NEYNAR_API_KEY_NOT_SET");
}

export default neynarClient;

type NeynarRequestOptions = {
  url: string;
  method: "GET" | "POST";
  queryParams?: Record<string, string>;
  data?: any;
  pagination?: {
    limit: number;
    cursor?: string;
  };
};

export async function makeNeynarRequest({
  url,
  method,
  queryParams,
  data,
  pagination,
}: NeynarRequestOptions): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      accept: "application/json",
      api_key: NEYNAR_API_KEY,
      "content-type": "application/json",
    },
  };

  if (queryParams || pagination) {
    const searchParams = new URLSearchParams(queryParams);
    if (pagination) {
      searchParams.append("limit", pagination.limit.toString());
      if (pagination.cursor) {
        searchParams.append("cursor", pagination.cursor);
      }
    }
    url += `?${searchParams.toString()}`;
  }

  if (method === "POST" && data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error data", errorData);

    const error = new Error();

    error.name = "Neynar API Error";
    error.message = JSON.stringify(errorData.message[0].message);

    throw error;
  }

  return await response.json();
}

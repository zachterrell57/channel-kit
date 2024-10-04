type WarpcastRequestOptions = {
  url: string;
  method: "GET" | "POST";
  queryParams?: Record<string, string>;
  data?: any;
  pagination?: {
    limit: number;
    cursor?: string;
  };
};

export async function makeWarpcastRequest({
  url,
  method,
  queryParams,
  data,
  pagination,
}: WarpcastRequestOptions): Promise<any> {
  const options: RequestInit = {
    method,
    headers: {
      accept: "application/json",
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
    error.name = "Warpcast API Error";
    error.message = JSON.stringify(errorData.errors[0].message);

    throw error;
  }

  return await response.json();
}

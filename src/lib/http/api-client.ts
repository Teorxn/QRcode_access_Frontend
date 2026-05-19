import { ApiError } from "@/lib/http/api-error";
import { getAuthToken } from "@/lib/http/auth-token";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

type RequestConfig = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: QueryParams;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

function createUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Define it in .env.");
  }

  const url = new URL(`${apiBaseUrl}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { body, query, headers, ...rest } = config;
  const isFormData = body instanceof FormData;

  const requestHeaders = new Headers(headers);
  if (body !== undefined && !isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(createUrl(path, query), {
    ...rest,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData || typeof body === "string"
          ? (body as BodyInit)
          : JSON.stringify(body),
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data && typeof data.message === "string"
        ? data.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, config?: Omit<RequestConfig, "body">) =>
    request<T>(path, { ...config, method: "GET" }),
  post: <T, B = unknown>(path: string, body?: B, config?: Omit<RequestConfig, "body">) =>
    request<T>(path, { ...config, method: "POST", body }),
  put: <T, B = unknown>(path: string, body?: B, config?: Omit<RequestConfig, "body">) =>
    request<T>(path, { ...config, method: "PUT", body }),
  patch: <T, B = unknown>(path: string, body?: B, config?: Omit<RequestConfig, "body">) =>
    request<T>(path, { ...config, method: "PATCH", body }),
  delete: <T>(path: string, config?: Omit<RequestConfig, "body">) =>
    request<T>(path, { ...config, method: "DELETE" }),
  download: async (path: string, config: Omit<RequestConfig, "body"> = {}): Promise<Blob> => {
    const { query, headers, ...rest } = config;

    const requestHeaders = new Headers(headers);
    const token = getAuthToken();
    if (token && !requestHeaders.has("Authorization")) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(createUrl(path, query), {
      ...rest,
      headers: requestHeaders,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(
        `Download failed with status ${response.status}`,
        response.status,
        text,
      );
    }

    return response.blob();
  },
};

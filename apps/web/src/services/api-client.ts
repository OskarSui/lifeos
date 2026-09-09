const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);

    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    if (!result.success) {
      throw new ApiClientError(result.error.message, response.status, result.error.code);
    }

    throw new ApiClientError("Request failed", response.status, "REQUEST_FAILED");
  }

  return result.data;
}

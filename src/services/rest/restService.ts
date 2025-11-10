import axios from 'axios';

export interface ApiRequestParams<TData = unknown> {
  method: string;
  url: string;
  data?: TData;
  config?: Record<string, unknown>;
}

export interface ApiResponse<TResponse = unknown> {
  data: TResponse | null;
  status: number;
  headers: Record<string, string>;
}

export async function apiRequest<TResponse = unknown, TData = unknown>(
  params: ApiRequestParams<TData>
): Promise<ApiResponse<TResponse>> {
  const { method, url, data, config } = params;

  try {
    const response = await axios.request<TResponse>({
      method,
      url,
      data,
      ...config,
    });

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(response.headers)) {
      if (typeof value === 'string') headers[key] = value;
    }

    return {
      data: response.data,
      status: response.status,
      headers,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
      throw error;
    }
    throw error;
  }
}

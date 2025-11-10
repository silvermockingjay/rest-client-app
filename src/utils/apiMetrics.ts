import { isAxiosError } from 'axios';
import { apiRequest, type ApiRequestParams, type ApiResponse } from '@/services/rest/restService';

export interface ApiResponseWithMetrics<TResponse = unknown> extends ApiResponse<TResponse> {
  metrics: {
    duration: string;
    timestamp: string;
    requestMethod: string;
    requestSize: number;
    responseSize: number;
    error?: string;
    endpoint: string;
  };
}

export async function apiRequestWithMetrics<TResponse = unknown, TData = unknown>(
  params: ApiRequestParams<TData>
): Promise<ApiResponseWithMetrics<TResponse>> {
  const { method, url, data } = params;
  const start = performance.now();
  const timestamp = new Date().toISOString();

  let requestSize = 0;
  if (data) {
    requestSize =
      typeof data === 'string'
        ? new TextEncoder().encode(data).length
        : new TextEncoder().encode(JSON.stringify(data)).length;
  }

  try {
    const response = await apiRequest<TResponse, TData>(params);

    let responseSize = 0;
    if (response.data) {
      responseSize =
        typeof response.data === 'string'
          ? new TextEncoder().encode(response.data).length
          : new TextEncoder().encode(JSON.stringify(response.data)).length;
    }

    const duration = performance.now() - start;
    const formattedDuration = `${Math.round(duration)}`;

    return {
      ...response,
      metrics: {
        duration: formattedDuration,
        timestamp,
        requestMethod: method,
        requestSize,
        responseSize,
        endpoint: url,
      },
    };
  } catch (error: unknown) {
    const duration = performance.now() - start;
    const formattedDuration = `${Math.round(duration)}`;
    let errorMessage = 'Unexpected error';
    if (isAxiosError(error)) errorMessage = error.response?.data || 'Unexpected error';

    return {
      data: null,
      status: isAxiosError(error) && error.response?.status ? error.response.status : 0,
      headers: {},
      metrics: {
        duration: formattedDuration,
        timestamp,
        requestMethod: method,
        requestSize,
        responseSize: 0,
        error: errorMessage,
        endpoint: url,
      },
    };
  }
}

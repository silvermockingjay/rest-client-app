import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { apiRequestWithMetrics } from './apiMetrics';
import { apiRequest } from '@/services/rest/restService';
import { isAxiosError } from 'axios';

vi.mock('@/services/rest/restService', () => ({
  apiRequest: vi.fn(),
}));

vi.mock('axios', () => ({
  isAxiosError: vi.fn(),
}));

describe('apiRequestWithMetrics', () => {
  const mockApiRequest = apiRequest as unknown as Mock;
  const mockIsAxiosError = isAxiosError as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns successful response with metrics for GET without data', async () => {
    mockApiRequest.mockResolvedValue({
      data: { result: 42 },
      status: 200,
      headers: { 'x-test': 'test' },
    });

    const params = { method: 'GET', url: '/test' };
    const response = await apiRequestWithMetrics(params);

    expect(response.data).toEqual({ result: 42 });
    expect(response.status).toBe(200);
    expect(response.headers).toEqual({ 'x-test': 'test' });
    expect(response.metrics).toHaveProperty('duration');
    expect(response.metrics.requestMethod).toBe('GET');
    expect(response.metrics.endpoint).toBe('/test');
    expect(response.metrics.requestSize).toBe(0);
    expect(response.metrics.responseSize).toBeGreaterThan(0);
  });

  it('calculates requestSize and responseSize for string data', async () => {
    mockApiRequest.mockResolvedValue({
      data: 'Some string response',
      status: 200,
      headers: {},
    });

    const params = { method: 'POST', url: '/string', data: 'PlainString' };
    const response = await apiRequestWithMetrics(params);

    expect(response.metrics.requestSize).toBe(new TextEncoder().encode('PlainString').length);
    expect(response.metrics.responseSize).toBe(
      new TextEncoder().encode('Some string response').length
    );
  });

  it('calculates requestSize and responseSize for object data', async () => {
    const payload = { key: 'value' };
    const responsePayload = { result: 'ok' };

    mockApiRequest.mockResolvedValue({
      data: responsePayload,
      status: 200,
      headers: {},
    });

    const params = { method: 'POST', url: '/object', data: payload };
    const response = await apiRequestWithMetrics(params);

    expect(response.metrics.requestSize).toBe(
      new TextEncoder().encode(JSON.stringify(payload)).length
    );
    expect(response.metrics.responseSize).toBe(
      new TextEncoder().encode(JSON.stringify(responsePayload)).length
    );
  });

  it('returns metrics with error for Axios error', async () => {
    const axiosError = {
      isAxiosError: true,
      response: { data: 'Bad request', status: 400 },
    };
    mockIsAxiosError.mockReturnValue(true);
    mockApiRequest.mockRejectedValue(axiosError);

    const params = { method: 'POST', url: '/test', data: { x: 1 } };
    const response = await apiRequestWithMetrics(params);

    expect(response.data).toBeNull();
    expect(response.status).toBe(400);
    expect(response.metrics.error).toBe('Bad request');
    expect(response.metrics.requestSize).toBeGreaterThan(0);
    expect(response.metrics.responseSize).toBe(0);
  });

  it('returns metrics with default error for unknown error', async () => {
    const unknownError = new Error('Some failure');
    mockIsAxiosError.mockReturnValue(false);
    mockApiRequest.mockRejectedValue(unknownError);

    const params = { method: 'GET', url: '/unknown' };
    const response = await apiRequestWithMetrics(params);

    expect(response.data).toBeNull();
    expect(response.status).toBe(0);
    expect(response.metrics.error).toBe('Unexpected error');
    expect(response.metrics.requestSize).toBe(0);
    expect(response.metrics.responseSize).toBe(0);
  });
});

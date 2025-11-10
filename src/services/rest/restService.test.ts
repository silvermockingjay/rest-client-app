import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import axios from 'axios';
import { apiRequest, type ApiRequestParams, type ApiResponse } from './restService';

vi.mock('axios');

describe('apiRequest', () => {
  const mockAxiosRequest = axios.request as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns data, status, and string headers on success', async () => {
    const responseData = { id: 1, name: 'Test' };
    const responseHeaders = { 'x-test': 'value', 'non-string': 123 };
    const responseStatus = 200;

    mockAxiosRequest.mockResolvedValue({
      data: responseData,
      status: responseStatus,
      headers: responseHeaders,
    });

    const params: ApiRequestParams = {
      method: 'GET',
      url: '/test',
    };

    const response: ApiResponse = await apiRequest(params);

    expect(response.data).toEqual(responseData);
    expect(response.status).toBe(responseStatus);
    expect(response.headers).toEqual({ 'x-test': 'value' });
  });

  it('passes data and config to axios.request', async () => {
    const params: ApiRequestParams = {
      method: 'POST',
      url: '/submit',
      data: { foo: 'bar' },
      config: { timeout: 5000 },
    };

    mockAxiosRequest.mockResolvedValue({
      data: { success: true },
      status: 201,
      headers: {},
    });

    await apiRequest(params);

    expect(mockAxiosRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/submit',
      data: { foo: 'bar' },
      timeout: 5000,
    });
  });

  it('throws axios error when axios rejects', async () => {
    const axiosError = new Error('Request failed');

    (axios.isAxiosError as unknown as Mock).mockReturnValue(true);
    mockAxiosRequest.mockRejectedValue(axiosError);

    const params: ApiRequestParams = { method: 'GET', url: '/fail' };

    await expect(apiRequest(params)).rejects.toThrow(axiosError);
    expect(axios.isAxiosError).toHaveBeenCalledWith(axiosError);
  });

  it('throws non-axios error as is', async () => {
    const unknownError = new Error('Unknown error');

    (axios.isAxiosError as unknown as Mock).mockReturnValue(false);
    mockAxiosRequest.mockRejectedValue(unknownError);

    const params: ApiRequestParams = { method: 'GET', url: '/fail' };

    await expect(apiRequest(params)).rejects.toThrow(unknownError);
    expect(axios.isAxiosError).toHaveBeenCalledWith(unknownError);
  });
});

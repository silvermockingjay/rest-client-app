import { describe, it, expect } from 'vitest';
import { getSupabaseAuthError, authErrors, type SupabaseAuthErrors } from './authErrors';

describe('getSupabaseAuthError', () => {
  it('returns the correct message for each known error code', () => {
    (Object.keys(authErrors) as SupabaseAuthErrors[]).forEach((code) => {
      const message = getSupabaseAuthError(code);
      expect(message).toBe(authErrors[code]);
    });
  });

  it('returns the fallback message for an unknown error code', () => {
    const unknownCode = 'some_random_error';
    expect(getSupabaseAuthError(unknownCode)).toBe('Something went wrong. Please try again.');
  });

  it('returns the fallback message when code is undefined', () => {
    expect(getSupabaseAuthError(undefined)).toBe('Something went wrong. Please try again.');
  });
});

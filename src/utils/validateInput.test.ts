import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { validateInput } from './validateInput';
import { ValidationError } from 'yup';
import { getAuthSchema } from './schema';
import type { AuthErrors } from './schema';
import type { InputName } from './validateInput';

vi.mock('./schema', () => ({
  getAuthSchema: vi.fn(),
}));

describe('validateInput', () => {
  const setErrors = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates input successfully and clears error', async () => {
    (getAuthSchema as unknown as Mock).mockReturnValue({
      validateAt: vi.fn().mockResolvedValue(true),
    });

    const key: InputName = 'email';
    const value = 'test@example.com';

    await validateInput({ key, value, setErrors });

    expect(setErrors).toHaveBeenCalled();
    const updateFn = setErrors.mock.calls[0][0];
    const prevErrors: AuthErrors = {
      email: [{ id: 0, message: '' }],
      name: [{ id: 0, message: '' }],
      password: [{ id: 0, message: '' }],
      isError: false,
    };
    const newState = updateFn(prevErrors);
    expect(newState.isError).toBe(false);
    expect(newState.email[0].message).toBe('');
  });

  it('sets error when validation fails', async () => {
    (getAuthSchema as unknown as Mock).mockReturnValue({
      validateAt: vi.fn().mockRejectedValue(new ValidationError('Invalid email')),
    });

    const key: InputName = 'email';
    const value = 'bad-email';

    await validateInput({ key, value, setErrors });

    expect(setErrors).toHaveBeenCalledTimes(1);
    const updater = setErrors.mock.calls[0][0];
    const prevErrors = {
      email: [{ id: 0, message: '' }],
      name: [{ id: 0, message: '' }],
      password: [{ id: 0, message: '' }],
      isError: false,
    };
    const newState = updater(prevErrors);

    expect(newState).toEqual({
      ...prevErrors,
      email: [{ id: 0, message: 'Invalid email' }],
      isError: true,
    });
  });
});

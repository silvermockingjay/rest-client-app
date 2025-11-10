import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import SignUp, { action } from './SignUp';
import type { ChangeEvent } from 'react';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
    initReactI18next: { type: '3rdParty', init: () => {} },
  };
});

vi.mock('@/utils/validateInput', () => ({
  validateInput: vi.fn(),
}));
const mockSignUp = vi.fn();

vi.mock('@/services/supabase/supabaseServer', () => ({
  createClient: () => ({
    supabase: { auth: { signUp: mockSignUp } },
  }),
}));

import { validateInput } from '@/utils/validateInput';

describe('SignUp component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <SignUp />,
          action: action,
        },
      ],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);
  };

  it('renders all form fields and the submit button', () => {
    renderWithRouter();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signUp/i })).toBeInTheDocument();
  });

  it('updates form state when inputs change', () => {
    renderWithRouter();

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    } as ChangeEvent<HTMLInputElement>);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } } as ChangeEvent<HTMLInputElement>);
    fireEvent.change(passwordInput, {
      target: { value: '123456' },
    } as ChangeEvent<HTMLInputElement>);

    expect(emailInput.value).toBe('test@example.com');
    expect(nameInput.value).toBe('John Doe');
    expect(passwordInput.value).toBe('123456');

    expect(validateInput).toHaveBeenCalledTimes(3);
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'email', value: 'test@example.com' })
    );
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'name', value: 'John Doe' })
    );
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'password', value: '123456' })
    );
  });

  it('toggles password visibility', () => {
    renderWithRouter();
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const togglerWrapper = screen.getByAltText(/eye show/i).parentElement;
    expect(togglerWrapper).not.toBeNull();
    if (!togglerWrapper) return;
    expect(passwordInput.type).toBe('password');
    fireEvent.click(togglerWrapper);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(togglerWrapper);
    expect(passwordInput.type).toBe('password');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider, type ActionFunctionArgs } from 'react-router-dom';
import SignIn, { action } from './SignIn';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
    initReactI18next: { type: '3rdParty', init: () => {} },
  };
});

const mockSignIn = vi.fn();
vi.mock('@/services/supabase/supabaseServer', () => ({
  createClient: () => ({
    supabase: { auth: { signInWithPassword: mockSignIn } },
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useRouteLoaderData: () => null,
    useActionData: () => ({ error: 'Test error message' }),
    Form: ({ children, ...props }: { children: React.ReactNode }) => (
      <form {...props}>{children}</form>
    ),
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
    redirect: (url: string) => new Response(null, { status: 302, headers: { Location: url } }),
  };
});

vi.mock('@/utils/validateInput', () => ({
  validateInput: vi.fn(),
}));

import { validateInput } from '@/utils/validateInput';

const renderWithRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SignIn />,
        action: action,
      },
    ],
    { initialEntries: ['/'] }
  );

  render(<RouterProvider router={router} />);
};

describe('SignIn component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    renderWithRouter();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
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

  it('renders error message from actionData.error', () => {
    renderWithRouter();
    expect(screen.getByText(/Something went wrong. Please try again./i)).toBeInTheDocument();
  });
});

describe('SignIn action function', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
  });

  const createMockRequest = (form: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    return new Request('http://localhost/signin', { method: 'POST', body: formData });
  };

  it('redirects on successful sign in', async () => {
    mockSignIn.mockResolvedValue({ data: {}, error: null });
    const request = createMockRequest({ email: 'test@example.com', password: '123456' });
    const result = await action({ request } as ActionFunctionArgs);

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });

    if (result instanceof Response) {
      expect(result.headers.get('Location')).toBe('/');
    } else {
      throw new Error(`Expected a Response, but got error: ${result.error}`);
    }
  });

  it('returns error when credentials are wrong', async () => {
    mockSignIn.mockResolvedValue({ data: null, error: { code: 'invalid_credentials' } });
    const request = createMockRequest({ email: 'wrong', password: 'wrong' });
    const result = await action({ request } as ActionFunctionArgs);
    expect(result).toEqual({ error: 'invalid_credentials' });
  });

  it('updates form state and calls validateInput on input change', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(passwordInput.value).toBe('123456');

    expect(validateInput).toHaveBeenCalledTimes(2);
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'email', value: 'test@example.com' })
    );
    expect(validateInput).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'password', value: '123456' })
    );
  });
});

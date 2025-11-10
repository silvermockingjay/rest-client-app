import RestClient from '@/pages/RestClient/RestClient.tsx';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { describe, vi, test, expect, beforeEach, afterEach } from 'vitest';
import { createMemoryRouter, RouterProvider, useRouteLoaderData } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import type { UserMetaData } from '@/services/supabase';
import userEvent from '@testing-library/user-event';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';

vi.mock('react-router-dom', async () => {
  const actualModule = await vi.importActual('react-router-dom');
  return {
    ...actualModule,
    useRouteLoaderData: vi.fn(),
  };
});

const mockedUseRouteLoaderData = useRouteLoaderData as unknown as ReturnType<typeof vi.fn>;

const createTestSession = (name?: string): Session => ({
  access_token: 'token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'refresh',
  user: {
    id: '1',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: { name } as UserMetaData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
});

function renderComponent({
  auth,
  isData = true,
  isError = false,
}: {
  auth?: boolean;
  isData?: boolean;
  isError?: boolean;
}) {
  if (auth) {
    const session = createTestSession('John Doe');
    mockedUseRouteLoaderData.mockReturnValue(session.user);
  }

  const errorResponse = {
    errorMessage: 'error message',
    status: 404,
  };

  const successResponse = {
    data: 'response body text',
    status: 200,
  };

  const initialEntries = isData
    ? '/rest-client/GET/aHR0cHM6Ly9hcGkuY29t/Ym9keSB0ZXh0?Content-Type=application%2Fjson'
    : '/rest-client';

  const router = createMemoryRouter(
    [
      {
        path: '/rest-client/:method?/:encodedUrl?/:encodedBody?',
        element: <RestClient />,
        action: async () => {
          return isError ? errorResponse : successResponse;
        },
      },
    ],
    {
      initialEntries: [initialEntries],
    }
  );

  return render(<RouterProvider router={router} />);
}

describe('<RestClient>', () => {
  beforeEach(() => {
    mockedUseRouteLoaderData.mockReturnValue(null);
    vi.clearAllMocks();
    restClientPageStore.setState(restClientPageStore.getInitialState());
  });
  afterEach(() => {
    cleanup();
  });

  describe('when the user is not authenticated', () => {
    test('not renders the page', () => {
      renderComponent({ auth: false });

      expect(screen.queryByTestId('rest-client-page')).not.toBeInTheDocument();
    });
  });

  describe('when the user is authenticated', () => {
    test('renders the page', () => {
      renderComponent({ auth: true, isData: false });

      expect(screen.queryByTestId('rest-client-page')).toBeInTheDocument();
    });
  });

  describe('renders the necessary elements', () => {
    test('renders <RequestBar>', () => {
      renderComponent({ auth: true });

      expect(screen.getByTestId('request-bar')).toBeInTheDocument();
    });

    test('renders <HeadersSection>', () => {
      renderComponent({ auth: true });

      expect(screen.getByTestId('headers-section')).toBeInTheDocument();
    });

    test('renders <RequestDataEditorOrViewer> in "editor" mode', () => {
      renderComponent({ auth: true });

      expect(screen.getByTestId('editor-section')).toBeInTheDocument();
    });

    test('renders <RequestDataEditorOrViewer> in "viewer" mode', () => {
      renderComponent({ auth: true });

      expect(screen.getByTestId('viewer-section')).toBeInTheDocument();
    });

    test('renders <CodeSection>', () => {
      renderComponent({ auth: true });

      expect(screen.getByTestId('code-section')).toBeInTheDocument();
    });
  });

  describe('no url data on page', () => {
    test('checks correct method', async () => {
      renderComponent({ auth: true, isData: false });

      const inputMethod = screen.getByPlaceholderText<HTMLInputElement>(/method/i);
      expect(inputMethod.value).toBe('');
    });

    test('checks correct endpoint', async () => {
      renderComponent({ auth: true, isData: false });

      const inputEndpoint = screen.getByPlaceholderText<HTMLInputElement>(/Endpoint URL/i);
      expect(inputEndpoint.value).toBe('');
    });

    test('checks correct headers', async () => {
      renderComponent({ auth: true, isData: false });

      const headerKey = screen.getAllByPlaceholderText<HTMLInputElement>(/key/i)[0];
      const headerValue = screen.getAllByPlaceholderText<HTMLInputElement>(/value/i)[0];

      expect(headerKey.value).toEqual('');
      expect(headerValue.value).toEqual('');
    });

    test('checks correct body', async () => {
      renderComponent({ auth: true, isData: false });

      const body = screen.getByTestId<HTMLTextAreaElement>('textarea-body-editor');

      expect(body.value).toEqual('');
    });

    test('checks correct code', async () => {
      renderComponent({ auth: true, isData: false });

      await waitFor(() => {
        expect(screen.getByTestId('pre-code').textContent).toContain('Invalid URL');
      });
    });
  });

  describe('url data on page', () => {
    test('checks correct method', async () => {
      renderComponent({ auth: true });

      const inputMethod = screen.getByPlaceholderText<HTMLInputElement>(/method/i);
      expect(inputMethod.value).toBe('GET');
    });

    test('checks correct endpoint', async () => {
      renderComponent({ auth: true });

      const inputEndpoint = screen.getByPlaceholderText<HTMLInputElement>(/Endpoint URL/i);
      expect(inputEndpoint.value).toBe('https://api.com');
    });

    test('checks correct headers', async () => {
      renderComponent({ auth: true });

      const headerKey = screen.getAllByPlaceholderText<HTMLInputElement>(/key/i)[0];
      const headerValue = screen.getAllByPlaceholderText<HTMLInputElement>(/value/i)[0];

      expect(headerKey.value).toEqual('Content-Type');
      expect(headerValue.value).toEqual('application/json');
    });

    test('checks correct body', async () => {
      renderComponent({ auth: true });

      const body = screen.getByTestId<HTMLTextAreaElement>('textarea-body-editor');

      expect(body.value).toEqual('body text');
    });

    test('checks correct code', async () => {
      renderComponent({ auth: true });

      const code = `
var client = new RestClient("https://api.com/");
var request = new RestRequest(Method.GET);
request.AddHeader("Content-Type", "application/json");
request.AddParameter("application/json", "body text", ParameterType.RequestBody);
IRestResponse response = client.Execute(request);
`
        .replace(/\s+/g, ' ')
        .trim();

      await waitFor(() => {
        expect(screen.getByTestId('pre-code')).toHaveTextContent(code);
      });
    });
  });

  describe('response', () => {
    describe('when the response is is success', () => {
      test('checks status', async () => {
        renderComponent({ auth: true, isData: true, isError: false });

        await userEvent.click(screen.getByRole('button', { name: /send/i }));

        await waitFor(() => {
          expect(screen.getByText('200')).toHaveClass('status-code success');
        });
      });

      test('checks message', async () => {
        renderComponent({ auth: true, isData: true, isError: false });

        await userEvent.click(screen.getByRole('button', { name: /send/i }));

        await waitFor(() =>
          expect(screen.getByTestId('pre-data')).toHaveTextContent('response body text')
        );
      });
    });

    describe('when the response an error', () => {
      test('checks status', async () => {
        renderComponent({ auth: true, isData: true, isError: true });

        await userEvent.click(screen.getByRole('button', { name: /send/i }));

        await waitFor(() => {
          expect(screen.getByText('404')).toHaveClass('status-code error');
        });
      });
    });
  });

  describe('functionality', () => {
    test('update method in url after sending request', async () => {
      renderComponent({ auth: true });

      const inputMethod = screen.getByPlaceholderText<HTMLInputElement>(/method/i);
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.clear(inputMethod);
      await userEvent.type(inputMethod, 'POST');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(inputMethod.value).toBe('POST');
      });
    });

    test('update endpoint in url after sending request', async () => {
      renderComponent({ auth: true });

      const inputEndpoint = screen.getByPlaceholderText<HTMLInputElement>(/Endpoint URL/i);
      const sendButton = screen.getByRole('button', { name: /send/i });
      await userEvent.clear(inputEndpoint);
      await userEvent.type(inputEndpoint, 'https://stapi.co/api/v1/rest/animal/search');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(inputEndpoint.value).toBe('https://stapi.co/api/v1/rest/animal/search');
      });
    });

    test('update headers in url after sending request', async () => {
      renderComponent({ auth: true });

      const headerKey = screen.getAllByPlaceholderText<HTMLInputElement>(/key/i)[0];
      const headerValue = screen.getAllByPlaceholderText<HTMLInputElement>(/value/i)[0];

      await userEvent.clear(headerKey);
      await userEvent.type(headerKey, 'Authorization');
      await userEvent.clear(headerValue);
      await userEvent.type(headerValue, 'Bearer token');

      await waitFor(() => {
        expect(headerKey.value).toEqual('Authorization');
        expect(headerValue.value).toEqual('Bearer token');
      });
    });

    test('update body in url after sending request', async () => {
      renderComponent({ auth: true });

      const body = screen.getByTestId<HTMLTextAreaElement>('textarea-body-editor');

      await userEvent.clear(body);
      await userEvent.type(body, 'new body text');

      await waitFor(() => {
        expect(body.value).toEqual('new body text');
      });
    });

    test('error when method is not selected', async () => {
      renderComponent({ auth: true, isData: false });

      await userEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        const errorContainer = screen.getByTestId('datalist-error');
        expect(errorContainer).toHaveTextContent(/Required field/i);
      });
    });

    test('no error when user type method', async () => {
      renderComponent({ auth: true, isData: false });

      await userEvent.click(screen.getByRole('button', { name: /send/i }));
      const method = screen.getByPlaceholderText(/method/i);
      await userEvent.type(method, 'GET');

      await waitFor(() => {
        const errorElement = screen.getByTestId('datalist-error');
        expect(errorElement).toHaveTextContent('');
      });
    });

    test('error when endpoint is empty', async () => {
      renderComponent({ auth: true, isData: false });

      await userEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        const errorContainer = screen.getByTestId('input-error');
        expect(errorContainer).toHaveTextContent(/Required field/i);
      });
    });

    test('no error when user type endpoint', async () => {
      renderComponent({ auth: true, isData: false });

      await userEvent.click(screen.getByRole('button', { name: /send/i }));
      const endpoint = screen.getByPlaceholderText(/endpoint URL/i);
      await userEvent.type(endpoint, 'https://api.com');

      await waitFor(() => {
        const errorElement = screen.getByTestId('input-error');
        expect(errorElement).toHaveTextContent('');
      });
    });
  });
});

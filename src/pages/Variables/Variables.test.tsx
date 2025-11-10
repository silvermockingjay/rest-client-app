import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouteLoaderData, createMemoryRouter, RouterProvider } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import type { UserMetaData } from '@/services/supabase';
import Home from '../Home/Home';
import Variables from './Variables';

vi.mock('react-router-dom', async () => {
  const actualModule = await vi.importActual('react-router-dom');
  return {
    ...actualModule,
    useRouteLoaderData: vi.fn(),
  };
});

const mockedUseRouteLoaderData = useRouteLoaderData as unknown as ReturnType<typeof vi.fn>;
const createRouter = () => {
  return createMemoryRouter(
    [
      { path: '/', element: <Home /> },
      { path: '/variables', element: <Variables /> },
    ],
    {
      initialEntries: ['/variables'],
    }
  );
};

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

const getItemLSSpy = vi.spyOn(window.localStorage.__proto__, 'getItem');
const setItemLSSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');

describe('Variables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to home page if user is not authorized', () => {
    mockedUseRouteLoaderData.mockReturnValue(null);
    render(<RouterProvider router={createRouter()} />);
    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
  });

  it('renders Variable page without variables', () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    getItemLSSpy.mockReturnValue('{}');
    render(<RouterProvider router={createRouter()} />);
    expect(getItemLSSpy).toHaveBeenCalledWith('variables');
    expect(screen.getByRole('button', { name: /add variable/i })).toBeInTheDocument();
  });

  it('renders Variable page with variables from LS', () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    getItemLSSpy.mockReturnValue('{"foo": "bar"}');
    render(<RouterProvider router={createRouter()} />);
    expect(getItemLSSpy).toHaveBeenCalledWith('variables');
    expect(screen.getByRole('button', { name: /add variable/i })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'foo' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'bar' })).toBeInTheDocument();
  });

  it('clicking trash icon button removes variable from the table and LS', async () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    getItemLSSpy.mockReturnValue('{"foo": "bar"}');
    render(<RouterProvider router={createRouter()} />);
    expect(getItemLSSpy).toHaveBeenCalledWith('variables');
    const row = screen.getByRole('row', { name: /foo bar/i });
    const trashIconBtn = within(row).getByRole('button');
    expect(trashIconBtn).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(trashIconBtn);
    expect(setItemLSSpy).toHaveBeenCalledWith('variables', '{}');
    await waitFor(() => {
      expect(screen.queryByText('foo')).not.toBeInTheDocument();
      expect(screen.queryByText('bar')).not.toBeInTheDocument();
    });
  });

  it('adds inputRow and save button when add variable button is clicked', async () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    render(<RouterProvider router={createRouter()} />);
    const user = userEvent.setup();
    const addBtn = screen.getByRole('button', { name: /add variable/i });
    expect(addBtn).toBeInTheDocument();
    await user.click(addBtn);
    expect(screen.getByTestId('input-row')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
  });

  it('removes inputRow and save button when trash icon button in inputRow is clicked', async () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    render(<RouterProvider router={createRouter()} />);
    const user = userEvent.setup();
    const addBtn = screen.getByRole('button', { name: /add variable/i });
    expect(addBtn).toBeInTheDocument();
    await user.click(addBtn);
    const inputRow = screen.getByTestId('input-row');
    const trashIconBtn = within(inputRow).getByRole('button');
    await user.click(trashIconBtn);
    await waitFor(() => {
      expect(screen.queryByTestId('input-row')).not.toBeInTheDocument();
    });
  });

  it('shows error message when saving variable without the name/value', async () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    render(<RouterProvider router={createRouter()} />);
    const user = userEvent.setup();
    const addBtn = screen.getByRole('button', { name: /add variable/i });
    await user.click(addBtn);
    expect(screen.getByTestId('input-row')).toBeInTheDocument();
    const saveBtn = screen.getByRole('button', { name: /save variable/i });
    await user.click(saveBtn);
    expect(screen.getByText('Variable name or value cannot be empty'));
  });

  it('shows error message when saving variable that already exists', async () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    getItemLSSpy.mockReturnValue('{"foo": "bar"}');
    render(<RouterProvider router={createRouter()} />);
    const user = userEvent.setup();
    const addBtn = screen.getByRole('button', { name: /add variable/i });
    await user.click(addBtn);
    const inputCells = screen.getAllByRole('textbox');
    await user.type(inputCells[0], 'foo');
    await user.type(inputCells[1], 'bar');
    const saveBtn = screen.getByRole('button', { name: /save variable/i });
    await user.click(saveBtn);
    expect(screen.getByText('Variable with this name already exists, choose another name'));
  });

  it('saves a new variable and shows it in the table', async () => {
    mockedUseRouteLoaderData.mockReturnValue(createTestSession().user);
    render(<RouterProvider router={createRouter()} />);
    const user = userEvent.setup();
    const addBtn = screen.getByRole('button', { name: /add variable/i });
    await user.click(addBtn);
    const inputCells = screen.getAllByRole('textbox');
    await user.type(inputCells[0], 'animal');
    await user.type(inputCells[1], 'dog');
    const saveBtn = screen.getByRole('button', { name: /save variable/i });
    await user.click(saveBtn);
    const newVariables = {
      foo: 'bar',
      animal: 'dog',
    };
    expect(setItemLSSpy).toHaveBeenCalledWith('variables', JSON.stringify(newVariables));
    expect(screen.getByRole('cell', { name: 'animal' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'dog' })).toBeInTheDocument();
  });
});

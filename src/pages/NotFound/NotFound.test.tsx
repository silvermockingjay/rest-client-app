import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import NotFound from './NotFound';
import Home from '@/pages/Home/Home';

const router = createMemoryRouter(
  [
    { path: '/', element: <Home /> },
    { path: '*', element: <NotFound /> },
  ],
  {
    initialEntries: ['/dogs'],
  }
);

describe('NotFound page', () => {
  it('renders 404 page when route is not found', () => {
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/This page does not exist/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /To home page/i })).toBeInTheDocument();
  });
  it('tests that "To home button" redirects to home page', async () => {
    render(<RouterProvider router={router} />);
    const homeBtn = screen.getByRole('button', { name: /To home page/i });
    const user = userEvent.setup();
    await user.click(homeBtn);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});

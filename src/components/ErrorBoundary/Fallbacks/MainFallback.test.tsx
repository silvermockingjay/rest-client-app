import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MainFallback from './MainFallback';

describe('MainFallback', () => {
  it('renders the component without crashing', () => {
    render(<MainFallback />);
    expect(screen.getByText(/Error page/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Oops, something went wrong. We are working on it, try visiting later/i)
    ).toBeInTheDocument();
  });
});

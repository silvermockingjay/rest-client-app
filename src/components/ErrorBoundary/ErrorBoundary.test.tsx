import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  function ProblemChild(): never {
    throw new Error('Test error');
  }

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback UI</div>}>
        <div>Normal Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText(/Normal Child/i)).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Fallback UI</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Fallback UI/i)).toBeInTheDocument();

    consoleError.mockRestore();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import Spinner from './Spinner';

vi.mock('@/assets/img/logo.svg', () => ({
  default: 'mock-logo.svg',
}));

describe('Spinner component', () => {
  it('renders an image with correct src, alt, and class', () => {
    render(<Spinner />);
    const img = screen.getByAltText('Loading...') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.src).toContain('mock-logo.svg');
    expect(img).toHaveClass('spinner');
  });
});

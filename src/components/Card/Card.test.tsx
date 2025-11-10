import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components';

const mockProfile = {
  id: 1,
  image: 'some-image-src',
  name: 'John Doe',
  role: 'team lead',
  description: 'Junior Frontend Developer',
  gh: 'gh-logo-src',
};

describe('Card', () => {
  it('renders card with the profile data', () => {
    render(<Card {...mockProfile} />);
    expect(screen.getByAltText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /John Doe/i })).toBeInTheDocument();
    expect(screen.getByText(/team lead/i)).toBeInTheDocument();
    expect(screen.getByText(/Junior Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByAltText(/GH Logo/i)).toBeInTheDocument();
  });
});

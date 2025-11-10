import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Footer from './Footer';

describe('Footer component', () => {
  it('renders the footer content', () => {
    render(<Footer />);
    expect(screen.getByText('2025')).toBeInTheDocument();
    const ghLink = screen.getByRole('link', { name: 'GitHub icon' });
    expect(ghLink).toHaveAttribute('href', 'https://github.com/Ryhus/rest-client-app');
    const rsLink = screen.getByRole('link', { name: 'RSSchool icon' });
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});

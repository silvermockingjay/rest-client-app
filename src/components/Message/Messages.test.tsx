import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Message from './Message';

describe('Message component', () => {
  it('renders text correctly', () => {
    render(<Message text="Hello world" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('applies the correct messageType class', () => {
    render(<Message text="Success" messageType="success" />);
    const messageElement = screen.getByText('Success');
    expect(messageElement).toHaveClass('message');
    expect(messageElement).toHaveClass('message--success');
  });

  it('handles no messageType gracefully', () => {
    render(<Message text="Default" />);
    const messageElement = screen.getByText('Default');

    expect(messageElement).toHaveClass('message');
  });
});

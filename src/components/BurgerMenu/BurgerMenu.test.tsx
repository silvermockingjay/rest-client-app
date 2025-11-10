import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BurgerMenu from './BurgerMenu';

describe('Burger menu', () => {
  it('renders closed burger menu component', async () => {
    const onClick = vi.fn();
    render(<BurgerMenu open={false} onClick={onClick} />);
    const menu = screen.getByTestId('burger-menu');
    expect(menu).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(menu);
    expect(onClick).toHaveBeenCalled();
  });
  it('renders open burger menu component', () => {
    const onClick = vi.fn();
    render(<BurgerMenu open={true} onClick={onClick} />);
    const menu = screen.getByTestId('burger-menu');
    expect(menu).toBeInTheDocument();
    expect(menu.querySelector('.bar1')).toHaveClass('open');
    expect(menu.querySelector('.bar2')).toHaveClass('open');
  });
});

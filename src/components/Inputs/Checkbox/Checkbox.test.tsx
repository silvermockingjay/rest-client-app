import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  const onChangeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the checkbox with a label', () => {
    render(<Checkbox labelTxt="Accept terms" />);
    const label = screen.getByText('Accept terms');
    expect(label).toBeInTheDocument();
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
  });

  it('applies the name prop to the input', () => {
    render(<Checkbox name="agree" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.name).toBe('agree');
  });

  it('sets checked state when isChecked prop is true', () => {
    render(<Checkbox isChecked />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('calls onChange handler when clicked', () => {
    render(<Checkbox onChange={onChangeMock} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('toggles checked state when clicked (controlled via prop)', () => {
    const { rerender } = render(<Checkbox isChecked={false} onChange={onChangeMock} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    rerender(<Checkbox isChecked={true} onChange={onChangeMock} />);
    expect(checkbox.checked).toBe(true);
  });
});

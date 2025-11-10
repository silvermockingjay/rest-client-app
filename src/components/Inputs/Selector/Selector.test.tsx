import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Selector from './Selector';

describe('Selector', () => {
  const onChangeMock = vi.fn();
  const data = ['Option 1', 'Option 2', 'Option 3'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the label if provided', () => {
    render(<Selector id="test" labelTxt="Test Label" data={data} />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test');
  });

  it('renders the select element with options', () => {
    render(<Selector id="test" data={data} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    data.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders the correct value if provided', () => {
    render(<Selector id="test" value="Option 2" data={data} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Option 2');
  });

  it('calls onChange handler when value changes', () => {
    render(<Selector id="test" onChange={onChangeMock} data={data} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'Option 3' } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('renders the name attribute if provided', () => {
    render(<Selector id="test" name="my-select" data={data} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('name', 'my-select');
  });
});

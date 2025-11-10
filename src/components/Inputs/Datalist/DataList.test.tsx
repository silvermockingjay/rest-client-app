import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Datalist from './Datalist';

describe('Datalist', () => {
  const data = ['Option 1', 'Option 2', 'Option 3'];
  const onChangeMock = vi.fn();

  it('renders input with placeholder, value, name and defaultValue', () => {
    render(
      <Datalist
        id="test"
        listName="list"
        data={data}
        name="my-input"
        placeholder="Enter something"
        value="Option 2"
      />
    );
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('Option 2');
    expect(input.placeholder).toBe('Enter something');
    expect(input.name).toBe('my-input');
  });

  it('renders datalist options', () => {
    render(<Datalist id="test" listName="list" data={data} />);
    const datalist = screen.getByRole('listbox', { hidden: true });
    expect(datalist).toBeInTheDocument();
    const options = Array.from(datalist.querySelectorAll('option'));
    expect(options.length).toBe(data.length);
    options.forEach((option, index) => {
      expect(option.value).toBe(data[index]);
    });
  });

  it('calls onChange handler when input value changes', () => {
    render(<Datalist id="test" listName="list" data={data} onChange={onChangeMock} />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Option 3' } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('applies border class by default and can be disabled', () => {
    const { rerender } = render(<Datalist id="test" listName="list" data={data} />);
    let input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input).toHaveClass('border');
    rerender(<Datalist id="test" listName="list" data={data} border={false} />);
    input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input).not.toHaveClass('border');
  });

  it('renders error messages if provided', () => {
    const errors = [
      { id: 1, message: 'Error 1' },
      { id: 2, message: 'Error 2' },
    ];
    render(<Datalist id="test" listName="list" data={data} errors={errors} />);
    errors.forEach((error) => {
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });
  });
});

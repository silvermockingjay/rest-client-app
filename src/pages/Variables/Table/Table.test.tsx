import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Table from './Table';
import type { VariablesTableProps } from './Table';
import InputRow from '../InputRow/InputRow';
import '../../../i18n';

const createRow = (row: [string, string]) => {
  return (
    <tr key={row[0]}>
      <td>{row[0]}</td>
      <td>{row[1]}</td>
      <td>
        <button>Delete</button>
      </td>
    </tr>
  );
};

const createInputRow = () => {
  return <InputRow value1="animal" value2="dog" onChange={() => vi.fn()} onClick={() => vi.fn()} />;
};

const mockTableData: VariablesTableProps<[string, string]> = {
  headers: ['key', 'value', ''],
  showHeaders: true,
  rows: [['foo', 'bar']],
  inputRow: true,
  renderInputRow: createInputRow,
  translation: 'variable',
  getTableRow: createRow,
  customClass: 'test-table',
  title: 'Test table',
};

describe('Table', () => {
  it('renders Table component with data correctly', () => {
    render(<Table {...mockTableData} />);
    expect(screen.getByTestId('table-container')).toHaveClass('test-table');
    expect(screen.getByRole('heading', { name: /test table/i })).toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('table');
    expect(screen.getAllByRole('rowgroup')).toHaveLength(2);
    const headers = screen.getByRole('row', { name: /key value/i });
    expect(headers).toBeInTheDocument();
    expect(within(headers).getByText('key')).toBeInTheDocument();
    expect(within(headers).getByText('value')).toBeInTheDocument();
    const rows = screen.getByRole('row', { name: /foo bar delete/i });
    expect(rows).toBeInTheDocument();
    expect(within(rows).getByText('foo')).toBeInTheDocument();
    expect(within(rows).getByText('bar')).toBeInTheDocument();
    expect(within(rows).getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /animal dog/i })).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByDisplayValue('animal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('dog')).toBeInTheDocument();
  });
});

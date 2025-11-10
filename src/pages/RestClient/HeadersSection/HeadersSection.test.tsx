import { cleanup, render, screen, waitFor } from '@testing-library/react';
import HeadersSection from '@/pages/RestClient/HeadersSection/HeadersSection.tsx';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import userEvent from '@testing-library/user-event';

function renderComponent() {
  return render(<HeadersSection />);
}

describe('<HeadersSection>', () => {
  beforeEach(() => {
    const initState = restClientPageStore.getInitialState();

    restClientPageStore.setState({
      ...initState,
      requestHeaders: [{ id: '1', name: 'Content-Type', value: 'application/json' }],
    });
  });

  afterEach(() => {
    cleanup();
  });

  describe('the necessary elements', () => {
    test('renders a title', () => {
      renderComponent();

      expect(screen.getByTestId('title')).toBeInTheDocument();
    });

    test('renders content', () => {
      renderComponent();

      const valueInput = screen.getByPlaceholderText<HTMLInputElement>(/value/i);
      expect(screen.getByTestId('content-container')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText(/Content-Type/i)).toBeInTheDocument();
      expect(valueInput.value).toBe('application/json');
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('functionality', () => {
    test('adding header by type key', async () => {
      renderComponent();
      const headerKeyInput = screen.getByPlaceholderText<HTMLInputElement>(/key/i);
      await userEvent.clear(headerKeyInput);
      await userEvent.type(headerKeyInput, 'someKey');

      expect(headerKeyInput.value).toBe('someKey');
    });

    test('adding header by type value', async () => {
      renderComponent();
      const headerValueInput = screen.getByPlaceholderText<HTMLInputElement>(/value/i);
      await userEvent.clear(headerValueInput);
      await userEvent.type(headerValueInput, 'someValue');

      expect(headerValueInput.value).toBe('someValue');
    });

    test('removing header by click button', async () => {
      renderComponent();
      const tableRow = screen.getAllByTestId('table-row')[0];
      const button = tableRow.getElementsByTagName('button')[0];
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getAllByTestId.length).toBe(0);
      });
    });
  });
});

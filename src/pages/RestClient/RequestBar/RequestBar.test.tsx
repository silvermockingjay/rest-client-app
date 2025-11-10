import { cleanup, render, screen } from '@testing-library/react';
import RequestBar, { type RequestBarProps } from '@/pages/RestClient/RequestBar/RequestBar.tsx';
import { afterEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

function renderComponent(params: Partial<RequestBarProps>) {
  const handleMethodOnChange = params.handleMethodOnChange || (() => {});
  const handleEndpointOnChange = params.handleEndpointOnChange || (() => {});
  const handleButtonClick = params.handleButtonClick || (() => {});

  return render(
    <RequestBar
      handleMethodOnChange={handleMethodOnChange}
      handleEndpointOnChange={handleEndpointOnChange}
      handleButtonClick={handleButtonClick}
      initMethod={params.initMethod}
      initSearchValue={params.initSearchValue}
      urlError={params.urlError}
      methodError={params.methodError}
    />
  );
}

describe('<RequestBar>', () => {
  afterEach(() => {
    cleanup();
  });

  describe('the necessary elements', () => {
    test('renders a selection of methods', () => {
      renderComponent({});

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('renders input for Endpoint URL', () => {
      renderComponent({});

      expect(screen.getByPlaceholderText(/Endpoint URL/i)).toBeInTheDocument();
    });

    test('renders button', () => {
      renderComponent({});

      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    test('renders method error', () => {
      renderComponent({ methodError: 'methodError' });

      expect(screen.getByText('methodError')).toBeInTheDocument();
    });

    test('renders endpoint error', () => {
      renderComponent({ urlError: 'endpointError' });

      expect(screen.getByText('endpointError')).toBeInTheDocument();
    });
  });

  describe('functionality', () => {
    test('changing method', async () => {
      const handleMethodOnChange = vi.fn();

      renderComponent({ handleMethodOnChange });

      const datalist = screen.getByRole('combobox');
      await userEvent.type(datalist, 'GET');

      expect(handleMethodOnChange).toHaveBeenCalled();
    });

    test('changing endpoint', async () => {
      const handleEndpointOnChange = vi.fn();

      renderComponent({ handleEndpointOnChange });

      const input = screen.getByPlaceholderText('Endpoint URL');
      await userEvent.type(input, 'https://stapi.co/animal/search');

      expect(handleEndpointOnChange).toHaveBeenCalled();
    });

    test('button click', async () => {
      const handleButtonClick = vi.fn();

      renderComponent({ handleButtonClick });

      const button = screen.getByRole('button', { name: /send/i });
      await userEvent.click(button);

      expect(handleButtonClick).toHaveBeenCalled();
    });
  });
});

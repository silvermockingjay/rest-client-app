import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const closeModalMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  const renderModal = (children: React.ReactNode = null) => {
    return render(<Modal closeModal={closeModalMock}>{children}</Modal>);
  };

  it('renders children inside a portal', () => {
    renderModal(<div data-testid="modal-child">Hello Modal</div>);
    const child = screen.getByTestId('modal-child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Hello Modal');
  });

  it('sets body overflow to hidden on mount and restores on unmount', () => {
    expect(document.body.style.overflow).toBe('');
    const { unmount } = renderModal();
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('calls closeModal when clicking on the backdrop', () => {
    renderModal(<div data-testid="modal-child">Hello Modal</div>);
    const child = screen.getByText('Hello Modal');
    const backdrop = child.parentElement;

    if (!backdrop) throw new Error('Backdrop element not found');

    fireEvent.mouseDown(backdrop);
    expect(closeModalMock).toHaveBeenCalled();
  });

  it('does NOT call closeModal when clicking inside the modal content', () => {
    renderModal(<div data-testid="modal-child">Hello Modal</div>);
    const child = screen.getByTestId('modal-child');
    fireEvent.mouseDown(child);
    expect(closeModalMock).not.toHaveBeenCalled();
  });

  it('calls closeModal when Escape key is pressed', () => {
    renderModal(<div data-testid="modal-child">Hello Modal</div>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(closeModalMock).toHaveBeenCalled();
  });

  it('does not call closeModal for other keys', () => {
    renderModal(<div data-testid="modal-child">Hello Modal</div>);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(closeModalMock).not.toHaveBeenCalled();
  });
});

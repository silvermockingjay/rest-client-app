import { createPortal } from 'react-dom';
import { useEffect } from 'react';

import './ModalStyles.scss';

interface ModalProps {
  closeModal: () => void;
  children?: React.ReactNode;
}

export default function Modal({ closeModal, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
    }

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  return createPortal(
    <div
      className="backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      {children}
    </div>,
    document.body
  );
}

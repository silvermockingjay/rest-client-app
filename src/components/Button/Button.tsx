import type { MouseEventHandler, ReactNode } from 'react';
import { ButtonStyle, ButtonType } from './types';
import clsx from 'clsx';

import './ButtonStyles.scss';

interface ButtonProps {
  type?: ButtonType;
  style: ButtonStyle;
  customClass?: string;
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function Button({
  type = ButtonType.Button,
  style,
  customClass,
  isDisabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx('button', style, customClass)}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

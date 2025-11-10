import type { MouseEventHandler } from 'react';
import './BurgerMenu.scss';
import clsx from 'clsx';

interface BurgerMenuProps {
  open: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function BurgerMenu({ open, onClick }: BurgerMenuProps) {
  return (
    <div className="burger-menu" onClick={onClick} data-testid="burger-menu">
      <div className={clsx('bar1', open && 'open')} />
      <div className={clsx('bar2', open && 'open')} />
    </div>
  );
}

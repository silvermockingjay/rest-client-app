import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LangToggler from './LangToggler';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/i18n', () => ({
  default: {
    changeLanguage: vi.fn(),
    resolvedLanguage: 'en',
  },
}));

import i18n from '@/i18n';

describe('LangToggler', () => {
  const languages = [{ code: 'en' }, { code: 'ru' }];

  it('renders all languages', () => {
    render(<LangToggler languages={languages} />);
    languages.forEach((lang) => {
      expect(screen.getByText(lang.code)).toBeTruthy();
    });
  });

  it('calls i18n.changeLanguage when a button is clicked', () => {
    render(<LangToggler languages={languages} />);
    fireEvent.click(screen.getByText('ru'));
    expect(i18n.changeLanguage).toHaveBeenCalledWith('ru');
  });

  it('disables the button for the current language', () => {
    render(<LangToggler languages={languages} />);
    const enButton = screen.getByText('en') as HTMLButtonElement;
    expect(enButton.disabled).toBe(true);
  });

  it('renders separators between buttons except the last one', () => {
    render(<LangToggler languages={languages} />);
    const separators = screen.getAllByText('|');
    expect(separators.length).toBe(languages.length - 1);
  });
});

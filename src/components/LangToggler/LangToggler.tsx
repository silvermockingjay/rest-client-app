import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

import './LangTogglerStyles.scss';

interface Language {
  code: string;
}

interface LangTogglerProps {
  languages: Language[];
}

export default function LangToggler({ languages }: LangTogglerProps) {
  const { t } = useTranslation('languages');
  const toggleLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nLang', lang);
  };
  return (
    <div className="lang-toggler">
      {languages.map((lang, index) => (
        <div key={lang.code} className="lang-toggler__group">
          <button
            onClick={() => toggleLang(lang.code)}
            disabled={lang.code === i18n.resolvedLanguage}
            className="lang-toggler__button"
          >
            {t(lang.code)}
          </button>
          {index < languages.length - 1 && <span className="separator">|</span>}
        </div>
      ))}
    </div>
  );
}

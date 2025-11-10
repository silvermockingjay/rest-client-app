import { Button } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';
import { useNavigate } from 'react-router-dom';

import './NotFound.scss';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/', { replace: true });
  };
  const { t } = useTranslation('not-found');

  return (
    <div className="not-found__container">
      <div className="not-found__content">
        <h1 className="not-found__title">{t('title')}</h1>
        <p className="not-found__info">{t('info')}</p>
        <Button style={ButtonStyle.Primary} type={ButtonType.Button} onClick={handleClick}>
          {t('homeBtn')}
        </Button>
      </div>
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className={`figure-${num}`} />
      ))}
    </div>
  );
}

import { useRouteLoaderData } from 'react-router-dom';
import { type User } from '@supabase/supabase-js';
import { Card } from '@/components';
import { useTranslation, Trans } from 'react-i18next';
import type { Profile } from '@/components/Card/Card';

import './HomeStyles.scss';

export default function Home() {
  const user = useRouteLoaderData<User>('root');
  const { t } = useTranslation('home');
  const team = t('team', { returnObjects: true }) as Profile[];

  return (
    <div className="home">
      <h2>
        {user
          ? t('welcomeUser', { user: user.user_metadata?.name ?? t('userNameFallback') })
          : t('welcomeGuest')}
      </h2>
      <section className="home__about">
        <p>{t('aboutApp')}</p>
        <p>
          <Trans
            i18nKey="aboutCourse"
            ns="home"
            values={{ courseName: 'RS School React 2025 Q3' }}
            components={{
              courseLink: (
                <a
                  className="link"
                  href="https://rs.school/courses/reactjs"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </p>
      </section>
      <section className="home__team-info">
        {team.map((person) => (
          <Card key={person.id} {...person} />
        ))}
      </section>
    </div>
  );
}

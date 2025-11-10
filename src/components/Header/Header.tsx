import { Link, useRouteLoaderData, Form, NavLink } from 'react-router-dom';
import logo from '@/assets/img/logo.svg';
import { useEffect, useState } from 'react';
import { guestLinks, userLinks } from '@/utils/navLinksConfig';
import { type User } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { languages } from '@/utils/languages';
import LangToggler from '../LangToggler/LangToggler';
import { BurgerMenu } from '@/components';

import './HeaderStyles.scss';

export default function Header() {
  const user = useRouteLoaderData<User>('root');
  const [openBurger, setOpenBurger] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerClass = isScrolled ? 'header scrolled' : 'header';
  const { t } = useTranslation('header');

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const closeBurger = (e: React.MouseEvent<HTMLElement>) => {
    if (openBurger && (e.target as HTMLElement).closest('a')) setOpenBurger(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={headerClass}>
      <div className="header__content">
        <Link to="/">
          <img className="app-logo" src={logo} alt="Rest client app logo" />
        </Link>
        <div className={openBurger ? 'header__menu slider' : 'header__menu'}>
          <nav className="navbar" onClick={closeBurger}>
            <div className="navbar__actions">
              {user ? (
                <>
                  <div className="navbar__actions--expanded-group">
                    {userLinks.map((link) => (
                      <NavLink
                        key={link.text}
                        to={link.to}
                        className={({ isActive, isPending }) =>
                          isPending
                            ? 'navbar__link pending'
                            : isActive
                              ? 'navbar__link active'
                              : 'navbar__link'
                        }
                      >
                        {t(link.text)}
                      </NavLink>
                    ))}
                  </div>
                  <div className="navbar__actions--basic-group">
                    <Form method="post" action="/logout">
                      <button className="button secondary">{t('signOut')}</button>
                    </Form>
                  </div>
                </>
              ) : (
                <div className="navbar__actions--basic-group">
                  {guestLinks.map((link) => (
                    <Link key={link.text} to={link.to} className="button secondary">
                      {t(link.text)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <LangToggler languages={languages} />
        </div>
        <BurgerMenu open={openBurger} onClick={() => setOpenBurger(!openBurger)} />
      </div>
    </header>
  );
}

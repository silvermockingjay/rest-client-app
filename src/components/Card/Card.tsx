import { useTranslation } from 'react-i18next';
import GHLogo from '@/assets/img/gh_logo.png';
import './Card.scss';

export interface Profile {
  id: number;
  image: string;
  name: string;
  role: string;
  description: string;
  gh: string;
}

export default function Card(profile: Profile) {
  const { t } = useTranslation('home');
  return (
    <div className="card-container" data-testid="card">
      <div>
        <img className="card-image" src={profile.image} alt={profile.name} />
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3>{profile.name}</h3>
          <p className={profile.role === t('primaryRole') ? 'card-role lead' : 'card-role'}>
            {profile.role}
          </p>
        </div>
        <div className="card-description">
          <p>{profile.description}</p>
        </div>
      </div>
      <a href={profile.gh} target="_blank" rel="noopener noreferrer">
        <img className="card-gh-logo" src={GHLogo} alt="GH Logo" />
      </a>
    </div>
  );
}

import './Footer.scss';
import GHLogo from '@/assets/img/gh_logo.png';
import RSLogo from '@/assets/img/rsschool_logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <a
          className="logo"
          href="https://github.com/Ryhus/rest-client-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={GHLogo} alt="GitHub icon" />
        </a>
        <p className="year">2025</p>
        <a
          className="logo"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={RSLogo} alt="RSSchool icon" />
        </a>
      </div>
    </footer>
  );
}

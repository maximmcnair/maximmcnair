import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/#" className={styles.title}>Maxim McNair</Link>
        <nav className={styles.links}>
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#articles">Articles</a>
          {/* <a href="#experiments">Experiments</a> */}
        </nav>
      </div>
    </header>
  );
} 
export default Header;

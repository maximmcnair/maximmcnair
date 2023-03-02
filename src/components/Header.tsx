import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/#" className={styles.title}>Maxim McNair</Link>
        <nav className={styles.links}>
          <Link href="/#about">About</Link>
          <Link href="/#work">Work</Link>
          <Link href="/#articles">Articles</Link>
          <Link href="/#experiments">Experiments</Link>
        </nav>
      </div>
    </header>
  );
} 
export default Header;

import Link from 'next/link';
import styles from './Header.module.css';

const Header: React.FC = () => {
  function handleScrollTo(evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, anchor: string){
    const $el = document.querySelector('#' + anchor)
    if (!$el) return;
    $el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    evt.preventDefault();
  }
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/#" className={styles.title}>Maxim McNair</Link>
        <nav className={styles.links}>
          <Link href="/#about" onClick={(evt) => handleScrollTo(evt, 'about')}>About</Link>
          <Link href="/#work" onClick={(evt) => handleScrollTo(evt, 'work')}>Work</Link>
          <Link href="/#experiments" onClick={(evt) => handleScrollTo(evt, 'experiments')}>Experiments</Link>
          <Link href="/#articles" onClick={(evt) => handleScrollTo(evt, 'articles')}>Articles</Link>
        </nav>
      </div>
    </header>
  );
} 
export default Header;

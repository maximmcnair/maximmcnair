import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const router = useRouter()
  const hideHeader = router.query.header === 'false';
  function handleScrollTo(evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>, anchor: string){
    const $el = document.querySelector('#' + anchor)
    if (!$el) return;
    $el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    evt.preventDefault();
  }
  if (hideHeader) return null;
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/#" className={styles.title}>Maxim McNair</Link>
        <nav className={styles.links}>
          <Link href="/#about" onClick={(evt) => handleScrollTo(evt, 'about')}>About</Link>
          <Link href="/#articles" onClick={(evt) => handleScrollTo(evt, 'articles')}>Articles</Link>
          <Link href="/#work" onClick={(evt) => handleScrollTo(evt, 'work')}>Work</Link>
        </nav>
      </div>
    </header>
  );
} 
export default Header;

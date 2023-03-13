import Draggable from 'react-draggable';
import styles from './Draggable.module.css'

interface Props {
  children: any;
  x: number;
  y: number;
  title: string;
  href?: string;
}

const DragComp: React.FC<Props> = ({ children, x: defaultX, y: defaultY, title, href }) => {
  return (
    <>
      <div className={styles.desktop}>
        <Draggable defaultPosition={{x: defaultX, y: defaultY}}>
          <div className={styles.content}>
            <header className={styles.header}>
              <div className={styles.close} />
              <div className={styles.minimise} />
              <div className={styles.maximise} />
              {href ? 
                <a href={href} target="_blank" rel="noreferrer" className={styles.link}>{title}</a>:
                <span>{title}</span>
              }
              <a href={href} target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={styles.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </header>
            {children}
          </div>
        </Draggable>
      </div>

      <div className={styles.mobile}>
        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.close} />
            <div className={styles.minimise} />
            <div className={styles.maximise} />
            <span>{title}</span>
            <a href={href} target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={styles.icon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </header>
          {children}
        </div>
      </div>
    </>
  );
}

export default  DragComp;

import Image from 'next/image';
import styles from './Work.module.css';

export default function Work() {
  return (
    <section className={styles.container}>
      <div className="content">
        <h2>Projects</h2>

        <article className={styles.work}>
          <div className={styles.workMedia}>
            <Image
              src="/img/work_inmysize.jpg"
              alt="InMySize"
              width={700}
              height={438}
              quality={100}
            />
          </div>
          <div className={styles.workDesc}>
            <h3 className={styles.workDescTitle}>InMySize</h3>
            <p className={styles.workDescParagraph}>
              InMySize is a streetwear shopping app that shows users clothing
              from multiple stores that are currently in stock. Sizes are
              continuously updated using Node-based crawlers. As a personal
              project, I designed and built it across web and mobile platforms
              using React.
            </p>
            <ul className="tags">
              <li>React Native</li>
              <li>Node JS</li>
              <li>Koa</li>
              <li>MongoDB</li>
              <li>Design</li>
            </ul>
          </div>
        </article>

        <article className={styles.work}>
          <div className={styles.workMedia}>
            <Image
              src="/img/work_keepyouraxesharp.jpg"
              alt="KeepTheAxeSharp"
              width={700}
              height={438}
              quality={100}
            />
          </div>
          <div className={styles.workDesc}>
            <h3 className={styles.workDescTitle}>Keep The Axe Sharp</h3>
            <p className={styles.workDescParagraph}>
              Keep The Axe Sharp uses flashcards and a repetition spaced
              learning algorithm to help programmers commit easy forgotten
              patterns, edge cases and shortcuts to memory.
            </p>
            <p className={styles.workDescParagraph}>
            </p>
            <ul className="tags">
              <li>React</li>
              <li>Node JS</li>
              <li>Gulp</li>
              <li>Design</li>
            </ul>
            <div className={styles.workDescBtn}>
              <a
                href="http://keeptheaxesharp.com/"
                target="_blank"
                rel="noreferrer"
                className="btn"
              >
                View Project
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

import { useRef, MouseEvent } from 'react';
import styles from './Articles.module.css';
import { Post } from '@/types';

interface Props {
  article: Post;
}

const perspective = '1000px';
const delta = 20;

export const Article: React.FC<Props> = ({ article: { slug, meta } }) => {
  const refArticle = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(evt: MouseEvent<HTMLAnchorElement>) {
    if (!refArticle?.current) return;
    const { offsetWidth: width, offsetHeight: height } = refArticle.current;
    const box = refArticle.current?.getBoundingClientRect();
    const docElem = document.documentElement;

    const top = box.top + window.pageYOffset - docElem.clientTop;
    const centerY = (height / 2) - (evt.pageY - top);

    const left = box.left + window.pageXOffset - docElem.clientLeft;
    const centerX = (width / 2) - (evt.pageX - left);

    refArticle.current.style.transform = `perspective(${perspective}) rotateX(${centerY / delta}deg) rotateY(${-(centerX / delta)}deg)`;
  }

  function handleMouseLeave() {
    if (!refArticle?.current) return;
    refArticle.current.style.transform = '';
  }

  return (
    <a
      href={`/p/${slug}`}
      ref={refArticle}
      className={styles.article}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h3 className={styles.title}>{meta.title}</h3>
      {meta?.thumb ? <img className={styles.image} src={meta.thumb} /> : null}
    </a>
  );
};

import styles from './SectionHeader.module.css';

interface Props {
  title: string;
  desc: string;
}

export default function SectionHeader({ title, desc }: Props) {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>
      <p className={styles.desc}>{desc}</p>
    </div>
  );
}

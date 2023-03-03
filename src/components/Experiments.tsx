import Link from 'next/link';

import styles from './Experiments.module.css';
import { experiments } from '@/utils/experiments';

const Experiments: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className="content">
        <h2>Experiments</h2>
        {experiments.map((p, idx) => (
          <Link href={`/experiment/${p.slug}`} key={idx}>
            <div>
              <span>{p.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default Experiments;

import type { NextPage } from 'next';
import { Layout } from '@/components/Layout';

interface Props {

}

const FiHKAL: NextPage<Props> = () => {
  return (
    <Layout title={''} desc={''}>
      <div className="content" style={{ paddingTop: 100 }}>
        <h1>Functions I have known and loved</h1>
      </div>
    </Layout>
  );
};

export default FiHKAL;

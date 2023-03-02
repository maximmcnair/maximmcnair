import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';

import { Layout } from '@/components/Layout';
import { experiments } from '@/utils/experiments';
import { Experiment } from '@/types';

interface Props {
  meta: Experiment;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: experiments.map((e) => {
      return {
        params: { slug: e.slug }
      };
    }),
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context?.params?.slug || '';
  return {
    props: {
      meta: experiments.find((e) => e.slug === slug)
    }
  };
};

const ExperimentView: NextPage<Props> = ({ meta }) => {
  const DynamicComp = dynamic(() => import(`../../experiments/${meta.src}`));

  return (
    <Layout title={''} desc={''}>
      <div className="content" style={{ paddingTop: 100 }}>
        <DynamicComp />
      </div>
    </Layout>
  );
};

export default ExperimentView;

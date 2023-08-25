import type { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import { experiments } from '@/utils/experiments';
import { Experiment } from '@/types';

interface Props {
  meta: Experiment;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: experiments
      .filter(e => !!e.slug && !e.published)
      .map(e => {
        return {
          params: { slug: e.slug },
        };
      }),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const slug = context?.params?.slug || '';
  return {
    props: {
      meta: experiments.find(e => e.slug === slug),
    },
  };
};

const ExperimentView: NextPage<Props> = ({ meta }) => {
  const DynamicComp = dynamic(() => import(`../../experiments/${meta.src}`));

  return (
    <>
      <Header />
      <div className="content" style={{ paddingTop: 100 }}>
        <DynamicComp />
      </div>
    </>
  );
};

export default ExperimentView;

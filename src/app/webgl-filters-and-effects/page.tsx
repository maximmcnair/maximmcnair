import { Metadata } from 'next';
import { Suspense } from 'react';

import { Layout } from "$/components/Layout";
import WebGL from '$/components/article/WebGLFilters/index';

export const metadata: Metadata = {
  title: 'WebGL filters and effects | Maxim McNair',
  description: 'Product engineer building creative tools for the web.',
};

export default async function WebGLFilterAndEffects() {
  return (
    <Layout>
      <Suspense fallback={<div />}>
        <main style={{ paddingBottom: 80 }}>
          <WebGL />
        </main>
      </Suspense>
    </Layout>
  );
}

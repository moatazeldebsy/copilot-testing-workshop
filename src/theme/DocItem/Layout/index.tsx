import React, { type ReactNode } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';
import FacilitatorBar from '@site/src/components/FacilitatorBar';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  return (
    <>
      <FacilitatorBar />
      <Layout {...props} />
    </>
  );
}

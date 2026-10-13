import React, { type ReactNode } from 'react';
import Content from '@theme-original/DocSidebar/Desktop/Content';
import type ContentType from '@theme/DocSidebar/Desktop/Content';
import type { WrapperProps } from '@docusaurus/types';
import SidebarProgress from '@site/src/components/SidebarProgress';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  return (
    <>
      <SidebarProgress />
      <Content {...props} />
    </>
  );
}

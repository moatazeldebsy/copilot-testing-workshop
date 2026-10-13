// Swizzled (ejected) from @docusaurus/theme-classic to add the workshop step badge
// and a completion check mark next to each sidebar link.
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type { Props } from '@theme/DocSidebarItem/Link';
import { useProgressContext } from '@site/src/context/ProgressContext';

import styles from './styles.module.css';

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const { href, label, className, autoAddBaseUrl, customProps } = item;
  const { isComplete } = useProgressContext();
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const step = customProps?.step as string | undefined;
  const stepPath = customProps?.path as string | undefined;
  const done = stepPath ? isComplete(stepPath) : false;

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx('menu__link', !isInternalLink && styles.menuExternalLink, {
          'menu__link--active': isActive,
        })}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}>
        {step && <span className="sidebar-step" aria-hidden="true">{step}</span>}
        <span className={styles.linkLabel}>{label}</span>
        {done && (
          <svg className="sidebar-check" viewBox="0 0 16 16" width="14" height="14" aria-label="Completed">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
        )}
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}

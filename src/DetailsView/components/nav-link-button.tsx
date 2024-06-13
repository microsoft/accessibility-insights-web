// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css, INavButtonProps } from '@fluentui/react';
import { Link } from '@fluentui/react-components';
import { NamedFC } from 'common/react/named-fc';
import { BaseLeftNavLink } from 'DetailsView/components/base-left-nav';
import styles from 'DetailsView/components/nav-link-button.scss';
import * as React from 'react';

export interface NavLinkButtonProps extends INavButtonProps {
    link: BaseLeftNavLink;
}

export const NavLinkButton = NamedFC<NavLinkButtonProps>('NavLinkButton', props => {
    const link = props.link;
    const ariaLabel = buildAriaLabel(link, props);

    return (
        <Link
            data-automation-id={link.key}
            aria-expanded={link.isExpanded}
            aria-label={ariaLabel}
            title={link.title || link.name}
            onClick={e => link.onClickNavLink(e, link)}
            className={css(styles.navLinkButton, props.className)}
            href={link.forceAnchor === true ? '#' : undefined}
        >
            {link.onRenderNavLink(link)}
        </Link>
    );
});

// This is a workaround to simulate the aria-current property because Orca (Ubuntu's SR) ignores it
const buildAriaLabel = (
    link: BaseLeftNavLink,
    props: React.PropsWithChildren<NavLinkButtonProps>,
) => {
    let ariaLabel = link.title || link.name;
    ariaLabel += props['aria-current'] ? ' (current page)' : '';
    return ariaLabel;
};

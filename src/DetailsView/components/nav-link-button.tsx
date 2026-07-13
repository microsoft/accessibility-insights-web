// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css, INavButtonProps, Link } from '@fluentui/react';
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
    let ariaLabel: string;
    if (link.title) {
        ariaLabel = link.title;
    } else if (link.index != null) {
        // When the link has no title (e.g. FastPass visualization links such as Issues,
        // NeedsReview, TabStops), include the index so the aria-label matches the visible
        // content (which renders the index inside a LeftNavIndexIcon followed by the name).
        // This satisfies axe-core 4.12's label-content-name-mismatch rule, which requires the
        // visible DOM text to be a substring of the accessible name.
        ariaLabel = `${link.index}: ${link.name}`;
    } else {
        ariaLabel = link.name;
    }
    ariaLabel += props['aria-current'] ? ' (current page)' : '';
    return ariaLabel;
};

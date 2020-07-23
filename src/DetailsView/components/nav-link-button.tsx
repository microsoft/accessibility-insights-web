// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { BaseLeftNavLink } from 'DetailsView/components/base-left-nav';
import * as styles from 'DetailsView/components/nav-link-button.scss';
import { css, INavButtonProps, Link } from 'office-ui-fabric-react';
import * as React from 'react';

export interface NavLinkButtonProps extends INavButtonProps {
    link: BaseLeftNavLink;
}

export const NavLinkButton = NamedFC<NavLinkButtonProps>('NavLinkButton', props => {
    const link = props.link;
    return (
        <Link
            aria-expanded={link.isExpanded}
            title={link.title || link.name}
            onClick={e => link.onClickNavLink(e, link)}
            className={css(styles.navLinkButton, props.className)}
            href={link.forceAnchor === true ? '#' : undefined}
        >
            {link.onRenderNavLink(link)}
        </Link>
    );
});

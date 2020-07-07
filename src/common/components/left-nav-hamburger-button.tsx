// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './left-nav-hamburger-button.scss';

export type LeftNavHamburgerButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export type LeftNavHamburgerButtonProps = {
    deps: LeftNavHamburgerButtonDeps;
    ariaLabel: string;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LeftNavHamburgerButton = NamedFC<LeftNavHamburgerButtonProps>(
    'LeftNavHamburgerButton',
    props => {
        const onClick = (event: React.MouseEvent<any>) => {
            const openSideNav = !props.isSideNavOpen;
            props.setSideNavOpen(openSideNav);
            if (openSideNav) {
                props.deps.detailsViewActionMessageCreator.leftNavPanelExpanded(event);
            }
        };

        return (
            <IconButton
                className={styles.leftNavHamburgerButton}
                iconProps={{ iconName: 'GlobalNavButton' }}
                ariaLabel={props.ariaLabel}
                aria-expanded={props.isSideNavOpen}
                onClick={onClick}
            />
        );
    },
);

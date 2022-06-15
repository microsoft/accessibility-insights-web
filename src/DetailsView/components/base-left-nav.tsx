// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INav, INavLink, LinkBase, Nav } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import styles from 'DetailsView/components/base-left-nav.scss';
import { NavLinkButton } from 'DetailsView/components/nav-link-button';
import * as React from 'react';

export type onBaseLeftNavItemClick = (
    event: React.MouseEvent<HTMLElement | typeof LinkBase, MouseEvent>,
    item: BaseLeftNavLink,
) => void;
export type onBaseLeftNavItemRender = (link: BaseLeftNavLink) => JSX.Element;

export type BaseLeftNavProps = {
    selectedKey: string;
    links: BaseLeftNavLink[];
    setNavComponentRef?: (nav: INav) => void;
};

export interface BaseLeftNavLink extends INavLink {
    percentComplete?: number;
    onRenderNavLink: onBaseLeftNavItemRender;
    onClickNavLink: onBaseLeftNavItemClick;
}

export interface BaseLeftNavLinkProps {
    link: BaseLeftNavLink;
    renderIcon: (link: BaseLeftNavLink) => JSX.Element;
}

export const BaseLeftNav = NamedFC<BaseLeftNavProps>('BaseLeftNav', props => {
    const { selectedKey, links, setNavComponentRef } = props;

    return (
        <Nav
            className={styles.detailsViewTestNavArea}
            selectedKey={selectedKey}
            groups={[
                {
                    links,
                },
            ]}
            linkAs={NavLinkButton}
            styles={{
                chevronButton: 'hidden',
            }}
            componentRef={setNavComponentRef}
        />
    );
});

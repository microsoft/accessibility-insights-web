// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as styles from 'DetailsView/components/base-left-nav.scss';
import { NavLinkButton } from 'DetailsView/components/nav-link-button';
import { INav, INavLink, LinkBase, Nav } from 'office-ui-fabric-react';
import * as React from 'react';

export type onBaseLeftNavItemClick = (
    event: React.MouseEvent<HTMLElement | LinkBase, MouseEvent>,
    item: BaseLeftNavLink,
) => void;
export type onBaseLeftNavItemRender = (link: BaseLeftNavLink) => JSX.Element;

export type BaseLeftNavProps = {
    selectedKey: string;
    links: BaseLeftNavLink[];
    setNavComponentRef: (nav: INav) => void;
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

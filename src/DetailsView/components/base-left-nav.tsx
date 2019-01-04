// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { INavLink, Nav } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';

import { DetailsViewLeftNav } from './details-view-left-nav';

export type BaseLeftNavProps = {
    selectedKey: string,
    links: BaseLeftNavLink[],
    renderIcon: (link: BaseLeftNavLink) => JSX.Element,
    onItemClick: (event: React.MouseEvent<HTMLElement>, item: BaseLeftNavLink) => void;
};

export interface BaseLeftNavLink extends INavLink {
    percentComplete?: number;
    onRenderNavLink: (link: BaseLeftNavLink, renderIcon: (link: BaseLeftNavLink) => JSX.Element) => JSX.Element;
    onClickNavLink: (event: React.MouseEvent<HTMLElement>, item: BaseLeftNavLink) => void;
}

export class BaseLeftNav extends React.Component<BaseLeftNavProps> {
    public render(): JSX.Element {
        const {
            selectedKey,
            links,
        } = this.props;

        return (
            <Nav
                className={DetailsViewLeftNav.pivotItemsClassName}
                selectedKey={selectedKey}
                groups={[{
                    links,
                }]}
                onRenderLink={this.onRenderLink}
                onLinkClick={this.onNavLinkClick}
            />
        );
    }

    @autobind
    protected onNavLinkClick(event: React.MouseEvent<HTMLElement>, item: BaseLeftNavLink): void {
        if (item) {
            item.onClickNavLink(event, item);
        }
    }

    @autobind
    protected onRenderLink(link: BaseLeftNavLink): JSX.Element {
        return link.onRenderNavLink(link, this.props.renderIcon);
    }
}

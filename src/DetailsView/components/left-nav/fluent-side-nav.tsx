// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import {
    DetailsViewLeftNav,
    DetailsViewLeftNavDeps,
    DetailsViewLeftNavProps,
} from 'DetailsView/components/left-nav/details-view-left-nav';
import * as styles from 'DetailsView/components/left-nav/fluent-side-nav.scss';
import { isNil } from 'lodash';
import { INav, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';

export type FluentSideNavDeps = DetailsViewLeftNavDeps;
export type FluentSideNavProps = Omit<DetailsViewLeftNavProps, 'setNavComponentRef'> & {
    tabStoreData: TabStoreData;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNarrowMode: boolean;
};

export class FluentSideNav extends React.Component<FluentSideNavProps> {
    protected navComponentRef: INav;

    public render(): JSX.Element {
        const tabClosed = this.props.tabStoreData.isClosed;

        if (tabClosed) {
            return null;
        }
        const navBar = (
            <DetailsViewLeftNav
                {...this.props}
                setNavComponentRef={nav => this.setNavComponentRef(nav)}
            />
        );

        const dismissPanel = (ev: React.SyntheticEvent<HTMLElement, Event>) => {
            if (isNil(ev)) {
                return;
            }
            this.props.setSideNavOpen(false);
        };

        const navPanel = (
            <GenericPanel
                className={classNames(styles.leftNavPanel, 'reflow-ui')}
                isOpen={this.props.isSideNavOpen}
                isLightDismiss
                hasCloseButton={false}
                onRenderNavigationContent={() => null}
                onRenderHeader={() => null}
                onRenderNavigation={() => null}
                onDismiss={dismissPanel}
                type={PanelType.customNear}
            >
                {navBar}
            </GenericPanel>
        );

        const navBarInSideNavContainer = <div id={styles.sideNavContainer}>{navBar}</div>;

        return this.props.isNarrowMode ? navPanel : navBarInSideNavContainer;
    }

    protected setNavComponentRef(nav: INav): void {
        this.navComponentRef = nav;
    }

    private isNavPanelConvertedToNavBar(prevProps: FluentSideNavProps): boolean {
        return (
            prevProps.isNarrowMode === true &&
            prevProps.isSideNavOpen === true &&
            this.props.isNarrowMode === false
        );
    }

    public componentDidUpdate(prevProps: FluentSideNavProps): void {
        if (this.isNavPanelConvertedToNavBar(prevProps)) {
            this.navComponentRef.focus(true);
        }
    }
}

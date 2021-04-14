// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import classNames from 'classnames';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import {
    InteractiveHeader,
    InteractiveHeaderDeps,
} from 'DetailsView/components/interactive-header';
import {
    DetailsViewLeftNav,
    DetailsViewLeftNavDeps,
    DetailsViewLeftNavProps,
} from 'DetailsView/components/left-nav/details-view-left-nav';
import * as styles from 'DetailsView/components/left-nav/fluent-side-nav.scss';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { INav, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';

export type FluentSideNavDeps = DetailsViewLeftNavDeps & InteractiveHeaderDeps;

export type FluentSideNavProps = Omit<DetailsViewLeftNavProps, 'setNavComponentRef'> & {
    deps: FluentSideNavDeps;
    tabStoreData: TabStoreData;
    isSideNavOpen: boolean;
    setSideNavOpen: (isOpen: boolean, event?: React.MouseEvent<any>) => void;
    narrowModeStatus: NarrowModeStatus;
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
            this.props.setSideNavOpen(false);
        };

        const renderHeader = () => {
            return (
                <InteractiveHeader
                    deps={this.props.deps}
                    tabClosed={false}
                    selectedPivot={this.props.selectedPivot}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                    navMenu={this.props.switcherNavConfiguration.leftNavHamburgerButton}
                    isSideNavOpen={this.props.isSideNavOpen}
                    setSideNavOpen={this.props.setSideNavOpen}
                    showFarItems={false}
                    showHeaderTitle={false}
                    narrowModeStatus={this.props.narrowModeStatus}
                />
            );
        };

        const navPanel = (
            <GenericPanel
                className={classNames(styles.leftNavPanel, 'reflow-ui')}
                isOpen={this.props.isSideNavOpen}
                isLightDismiss
                hasCloseButton={false}
                onRenderNavigationContent={() => null}
                onRenderHeader={renderHeader}
                onRenderNavigation={() => null}
                onDismiss={dismissPanel}
                type={PanelType.customNear}
            >
                {navBar}
            </GenericPanel>
        );

        const navBarInSideNavContainer = <div id={styles.sideNavContainer}>{navBar}</div>;

        return this.props.narrowModeStatus.isHeaderAndNavCollapsed
            ? navPanel
            : navBarInSideNavContainer;
    }

    protected setNavComponentRef(nav: INav): void {
        this.navComponentRef = nav;
    }

    private isNavPanelConvertedToNavBar(prevProps: FluentSideNavProps): boolean {
        return (
            prevProps.narrowModeStatus.isHeaderAndNavCollapsed === true &&
            prevProps.isSideNavOpen === true &&
            this.props.narrowModeStatus.isHeaderAndNavCollapsed === false
        );
    }

    public componentDidUpdate(prevProps: FluentSideNavProps): void {
        if (this.isNavPanelConvertedToNavBar(prevProps)) {
            this.navComponentRef.focus(true);
        }
    }
}

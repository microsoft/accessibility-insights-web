// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
import { PanelType } from 'office-ui-fabric-react';
import * as React from 'react';

export type FluentSideNavDeps = DetailsViewLeftNavDeps & InteractiveHeaderDeps;
export type FluentSideNavProps = DetailsViewLeftNavProps & {
    deps: FluentSideNavDeps;
    tabStoreData: TabStoreData;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export class FluentSideNav extends React.Component<FluentSideNavProps> {
    public render(): JSX.Element {
        const tabClosed = this.props.tabStoreData.isClosed;

        if (tabClosed) {
            return null;
        }
        const nav = <DetailsViewLeftNav {...this.props} />;

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
                />
            );
        };

        const navPanel = (
            <GenericPanel
                className={styles.leftNavPanel}
                isOpen={this.props.isSideNavOpen}
                isLightDismiss
                hasCloseButton={false}
                onRenderNavigationContent={() => null}
                onRenderHeader={renderHeader}
                onRenderNavigation={() => null}
                onDismiss={dismissPanel}
                type={PanelType.customNear}
                layerProps={{
                    hostId: styles.sideNavContainer,
                }}
            >
                {nav}
            </GenericPanel>
        );

        return (
            <div id={styles.sideNavContainer}>
                {nav}
                {navPanel}
            </div>
        );
    }
}

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import {
    DetailsViewLeftNav,
    DetailsViewLeftNavDeps,
    DetailsViewLeftNavProps,
} from 'DetailsView/components/left-nav/details-view-left-nav';
import * as styles from 'DetailsView/components/left-nav/fluent-side-nav.scss';
import { isNil } from 'lodash';
import { PanelType } from 'office-ui-fabric-react';
import * as React from 'react';

export type FluentSideNavDeps = DetailsViewLeftNavDeps;
export type FluentSideNavProps = DetailsViewLeftNavProps & {
    tabStoreData: TabStoreData;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNarrowMode: boolean;
};

export class FluentSideNav extends React.Component<FluentSideNavProps> {
    public render(): JSX.Element {
        const tabClosed = this.props.tabStoreData.isClosed;

        if (tabClosed) {
            return null;
        }
        const navBar = <DetailsViewLeftNav {...this.props} />;

        const dismissPanel = (ev: React.SyntheticEvent<HTMLElement, Event>) => {
            if (isNil(ev)) {
                return;
            }
            this.props.setSideNavOpen(false);
        };

        const navPanel = (
            <GenericPanel
                className={styles.leftNavPanel}
                isOpen={this.props.isSideNavOpen}
                isLightDismiss
                hasCloseButton={false}
                onRenderNavigationContent={() => null}
                onRenderHeader={() => null}
                onRenderNavigation={() => null}
                onDismiss={dismissPanel}
                type={PanelType.customNear}
                layerProps={{
                    hostId: styles.sideNavContainer,
                }}
            >
                {navBar}
            </GenericPanel>
        );

        const renderNav = () => {
            return this.props.isNarrowMode ? navPanel : navBar;
        };

        return <div id={styles.sideNavContainer}>{renderNav()}</div>;
    }
}

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { FeatureFlags } from 'common/feature-flags';
import { NamedFC } from 'common/react/named-fc';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import {
    DetailsViewLeftNav,
    DetailsViewLeftNavDeps,
    DetailsViewLeftNavProps,
} from 'DetailsView/components/left-nav/details-view-left-nav';
import * as styles from 'DetailsView/components/left-nav/fluent-side-nav.scss';
import { PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

export type FluentSideNavDeps = DetailsViewLeftNavDeps;
export type FluentSideNavProps = DetailsViewLeftNavProps & {
    tabStoreData: TabStoreData;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FluentSideNav = NamedFC<FluentSideNavProps>('FluentSideNav', props => {
    const tabClosed = props.tabStoreData.isClosed;

    if (tabClosed) {
        return null;
    }

    const navBar = () => <DetailsViewLeftNav {...props} />;

    const navPanel = () => {
        return (
            <GenericPanel
                className={styles.leftNavPanel}
                isOpen={props.isSideNavOpen}
                isLightDismiss
                hasCloseButton={false}
                onRenderNavigationContent={() => null}
                onRenderHeader={() => null}
                onRenderNavigation={() => null}
                onDismiss={() => props.setSideNavOpen(false)}
                type={PanelType.customNear}
                layerProps={{
                    hostId: styles.sideNavContainer,
                }}
            >
                {navBar()}
            </GenericPanel>
        );
    };

    const renderNav = (width: number) => {
        return width < 600 ? navPanel() : navBar();
    };

    return (
        <div id={styles.sideNavContainer}>
            <FlaggedComponent
                enableJSXElement={
                    <ReactResizeDetector handleWidth querySelector="body">
                        {({ width }) => renderNav(width)}
                    </ReactResizeDetector>
                }
                disableJSXElement={navBar()}
                featureFlag={FeatureFlags.reflowUI}
                featureFlagStoreData={props.featureFlagStoreData}
            />
        </div>
    );
});

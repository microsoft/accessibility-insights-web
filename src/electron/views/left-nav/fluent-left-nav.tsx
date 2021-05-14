// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FastPassLeftNavHamburgerButton } from 'common/components/expand-collapse-left-nav-hamburger-button';
import { NamedFC } from 'common/react/named-fc';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import * as styles from 'electron/views/left-nav/fluent-left-nav.scss';
import { LeftNav, LeftNavDeps, LeftNavProps } from 'electron/views/left-nav/left-nav';
import { PanelType } from 'office-ui-fabric-react';
import * as React from 'react';

export const fluentLeftNavAutomationId = 'fluent-left-nav';

export type FluentLeftNavDeps = LeftNavDeps;

export type FluentLeftNavProps = {
    deps: FluentLeftNavDeps;
    narrowModeStatus: NarrowModeStatus;
    selectedKey: LeftNavItemKey;
    isNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & LeftNavProps;

export const FluentLeftNav = NamedFC<FluentLeftNavProps>('LeftNav', props => {
    const { narrowModeStatus, selectedKey, isNavOpen, deps, setSideNavOpen, featureFlagStoreData } =
        props;
    const leftNav = (
        <LeftNav
            selectedKey={selectedKey}
            deps={deps}
            featureFlagStoreData={featureFlagStoreData}
        />
    );

    if (!narrowModeStatus.isHeaderAndNavCollapsed) {
        return leftNav;
    }

    return (
        <GenericPanel
            innerPanelAutomationId={fluentLeftNavAutomationId}
            layerProps={{ className: styles.leftNavPanelHost }}
            className={styles.leftNavPanel}
            isOpen={isNavOpen}
            hasCloseButton={false}
            onRenderNavigationContent={() => null}
            onRenderNavigation={() => null}
            type={PanelType.customNear}
            onDismiss={() => setSideNavOpen(false)}
        >
            <div className={styles.navMenuContainer}>
                <FastPassLeftNavHamburgerButton
                    isSideNavOpen={isNavOpen}
                    setSideNavOpen={setSideNavOpen}
                    className={styles.navMenu}
                />
            </div>
            {leftNav}
        </GenericPanel>
    );
});

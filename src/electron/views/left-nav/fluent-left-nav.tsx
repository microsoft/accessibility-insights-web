// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import { leftNavPanel, titleBarLookalike } from 'electron/views/left-nav/fluent-left-nav.scss';
import { LeftNav, LeftNavDeps } from 'electron/views/left-nav/left-nav';
import { PanelType } from 'office-ui-fabric-react';
import * as React from 'react';

export type FluentLeftNavDeps = LeftNavDeps;

export type FluentLeftNavProps = {
    deps: FluentLeftNavDeps;
    narrowModeStatus: NarrowModeStatus;
    selectedKey: LeftNavItemKey;
    isNavOpen: boolean;
};

export const FluentLeftNav = NamedFC<FluentLeftNavProps>('LeftNav', props => {
    const { narrowModeStatus, selectedKey, isNavOpen, deps } = props;
    const leftNav = <LeftNav selectedKey={selectedKey} deps={deps} />;

    if (!narrowModeStatus.isHeaderAndNavCollapsed) {
        return leftNav;
    }

    return (
        <GenericPanel
            className={leftNavPanel}
            isOpen={isNavOpen}
            isLightDismiss
            hasCloseButton={false}
            onRenderNavigationContent={() => null}
            onRenderNavigation={() => null}
            // onDismiss={dismissPanel}
            type={PanelType.customNear}
        >
            <div className={titleBarLookalike} />
            {leftNav}
        </GenericPanel>
    );
});

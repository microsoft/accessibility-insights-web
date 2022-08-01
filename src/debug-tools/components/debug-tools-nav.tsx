// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Nav } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { DebugToolsNavActionCreator } from 'debug-tools/action-creators/debug-tools-nav-action-creator';
import { DebugToolsNavStoreData, ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';
import * as React from 'react';

export type DebugToolsNavState = {
    debugToolsNavStoreData: DebugToolsNavStoreData;
};
export type DebugToolsNavDeps = {
    debugToolsNavActionCreator: DebugToolsNavActionCreator;
};

export type DebugToolsNavProps = {
    deps: DebugToolsNavDeps;
    state: DebugToolsNavState;
    className: string;
};

export const DebugToolsNav = NamedFC<DebugToolsNavProps>(
    'ToolsNav',
    ({ className, deps, state }) => {
        const { debugToolsNavStoreData } = state;
        return (
            <Nav
                className={className}
                selectedKey={debugToolsNavStoreData.selectedTool}
                groups={[
                    {
                        links: [
                            {
                                key: 'stores',
                                name: 'Stores',
                                url: '',
                                icon: 'OfflineStorage',
                            },
                            {
                                key: 'telemetryViewer',
                                name: 'TelemetryViewer',
                                url: '',
                                icon: 'Diagnostic',
                            },
                        ],
                    },
                ]}
                onLinkClick={async (ev, item) =>
                    await deps.debugToolsNavActionCreator.onSelectTool(item.key as ToolsNavKey)
                }
            />
        );
    },
);

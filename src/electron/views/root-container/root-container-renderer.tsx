// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Theme, ThemeDeps } from 'common/components/theme';
import { LeftNavDeps } from 'electron/views/left-nav/left-nav-deps';
import {
    PlatformBodyClassModifier,
    PlatformBodyClassModifierDeps,
} from 'electron/views/root-container/components/platform-body-class-modifier';
import {
    RootContainer,
    RootContainerDeps,
} from 'electron/views/root-container/components/root-container';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContentPanelDeps } from '../left-nav/content-panel-deps';

export type RootContainerRendererDeps = RootContainerDeps &
    ThemeDeps &
    PlatformBodyClassModifierDeps &
    LeftNavDeps &
    ContentPanelDeps;

export class RootContainerRenderer {
    constructor(
        private readonly renderer: typeof ReactDOM.render,
        private readonly dom: ParentNode,
        private readonly deps: RootContainerRendererDeps,
    ) {}

    public render(): void {
        this.deps.windowStateActionCreator.setRoute({ routeId: 'deviceConnectView' });

        const rootContainer = this.dom.querySelector('#root-container');
        this.renderer(
            <>
                <PlatformBodyClassModifier deps={this.deps} />
                <Theme deps={this.deps} />
                <RootContainer deps={this.deps} />
            </>,
            rootContainer,
        );
    }
}

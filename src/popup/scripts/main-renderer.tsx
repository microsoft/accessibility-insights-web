// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserAdapter } from '../../background/browser-adapter';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { subtitle, title } from '../../content/strings/application';
import { DiagnosticViewToggleFactory } from './components/diagnostic-view-toggle-factory';
import { PopupViewControllerDeps, PopupViewWithStoreSubscription } from './components/popup-view';
import { IPopupHandlers } from './handlers/ipopup-handlers';
import { LaunchPadRowConfigurationFactory } from './launch-pad-row-configuration-factory';
import { Theme, ThemeInnerState } from '../../common/components/theme';
import { WithStoreSubscriptionDeps } from '../../common/components/with-store-subscription';

export type MainRendererDeps = PopupViewControllerDeps & WithStoreSubscriptionDeps<ThemeInnerState>;
export class MainRenderer {
    constructor(
        private readonly deps: MainRendererDeps,
        private readonly popupHandlers: IPopupHandlers,
        private readonly renderer: typeof ReactDOM.render,
        private readonly dom: NodeSelector & Node,
        private readonly popupWindow: Window,
        private readonly browserAdapter: BrowserAdapter,
        private readonly targetTabUrl: string,
        private readonly hasAccess: boolean,
        private readonly launchPadRowConfigurationFactory: LaunchPadRowConfigurationFactory,
        private readonly diagnosticViewToggleFactory: DiagnosticViewToggleFactory,
        private readonly dropdownClickHandler: DropdownClickHandler,
    ) {}

    public render(): void {
        const container = this.dom.querySelector('#popup-container');

        this.renderer(
            <>
                <Theme deps={this.deps} />
                <PopupViewWithStoreSubscription
                    deps={this.deps}
                    title={title}
                    subtitle={subtitle}
                    popupHandlers={this.popupHandlers}
                    popupWindow={this.popupWindow}
                    browserAdapter={this.browserAdapter}
                    targetTabUrl={this.targetTabUrl}
                    hasAccess={this.hasAccess}
                    launchPadRowConfigurationFactory={this.launchPadRowConfigurationFactory}
                    diagnosticViewToggleFactory={this.diagnosticViewToggleFactory}
                    dropdownClickHandler={this.dropdownClickHandler}
                />
                ,
            </>,
            container,
        );
    }
}

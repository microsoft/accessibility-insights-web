// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock } from 'typemoq';

import { BrowserAdapter, ChromeAdapter } from '../../../../../background/browser-adapter';
import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { subtitle, title } from '../../../../../content/strings/application';
import { DiagnosticViewToggleFactory } from '../../../../../popup/scripts/components/diagnostic-view-toggle-factory';
import { PopupViewWithStoreSubscription } from '../../../../../popup/scripts/components/popup-view';
import { DiagnosticViewClickHandler } from '../../../../../popup/scripts/handlers/diagnostic-view-toggle-click-handler';
import { LaunchPanelHeaderClickHandler } from '../../../../../popup/scripts/handlers/launch-panel-header-click-handler';
import { PopupViewControllerHandler } from '../../../../../popup/scripts/handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from '../../../../../popup/scripts/launch-pad-row-configuration-factory';
import { MainRenderer, MainRendererDeps } from '../../../../../popup/scripts/main-renderer';
import { SupportLinkHandler } from '../../../../../popup/support-link-handler';

describe('MainRenderer', () => {
    const expectedTitle = title;
    const expectedSubtitle = subtitle;

    test('render', () => {
        const dom = document.createElement('div');
        const container = document.createElement('div');
        container.setAttribute('id', 'popup-container');
        dom.appendChild(container);

        const diagnosticViewClickHandlerMock = Mock.ofType(DiagnosticViewClickHandler);
        const gettingStartedDialogHandlerMock = Mock.ofType(PopupViewControllerHandler);
        const feedbackMenuClickhandlerMock = Mock.ofType(LaunchPanelHeaderClickHandler);
        const supportLinkHandlerMock = Mock.ofType(SupportLinkHandler);
        const launchPadRowConfigurationFactoryMock = Mock.ofType(LaunchPadRowConfigurationFactory);
        const diagnosticViewToggleFactoryMock = Mock.ofType(DiagnosticViewToggleFactory);
        const dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);

        const popupWindowMock = Mock.ofInstance(window);
        const browserAdapterMock = Mock.ofType<BrowserAdapter>(ChromeAdapter);
        const hasAccess = true;
        const targetTabUrl = 'url';

        const deps: MainRendererDeps = Mock.ofType<MainRendererDeps>().object;

        renderMock
            .setup(r =>
                r(
                    It.isValue(
                        <PopupViewWithStoreSubscription
                            deps={deps}
                            title={expectedTitle}
                            subtitle={expectedSubtitle}
                            popupHandlers={{
                                diagnosticViewClickHandler: diagnosticViewClickHandlerMock.object,
                                popupViewControllerHandler: gettingStartedDialogHandlerMock.object,
                                launchPanelHeaderClickHandler: feedbackMenuClickhandlerMock.object,
                                supportLinkHandler: supportLinkHandlerMock.object,
                            }}
                            popupWindow={popupWindowMock.object}
                            browserAdapter={browserAdapterMock.object}
                            targetTabUrl={targetTabUrl}
                            hasAccess={hasAccess}
                            launchPadRowConfigurationFactory={launchPadRowConfigurationFactoryMock.object}
                            diagnosticViewToggleFactory={diagnosticViewToggleFactoryMock.object}
                            dropdownClickHandler={dropdownClickHandlerMock.object}
                        />,
                    ),
                    container,
                ),
            )
            .verifiable();

        const renderer = new MainRenderer(
            deps,
            {
                diagnosticViewClickHandler: diagnosticViewClickHandlerMock.object,
                popupViewControllerHandler: gettingStartedDialogHandlerMock.object,
                launchPanelHeaderClickHandler: feedbackMenuClickhandlerMock.object,
                supportLinkHandler: supportLinkHandlerMock.object,
            },
            renderMock.object,
            dom,
            popupWindowMock.object,
            browserAdapterMock.object,
            targetTabUrl,
            hasAccess,
            launchPadRowConfigurationFactoryMock.object,
            diagnosticViewToggleFactoryMock.object,
            dropdownClickHandlerMock.object,
        );

        renderer.render();

        renderMock.verifyAll();
    });
});

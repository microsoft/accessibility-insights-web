// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock } from 'typemoq';

import { ChromeAdapter, BrowserAdapter } from '../../../../../background/browser-adapter';
import { CommandStore } from '../../../../../background/stores/global/command-store';
import { FeatureFlagStore } from '../../../../../background/stores/global/feature-flag-store';
import { LaunchPanelStore } from '../../../../../background/stores/global/launch-panel-store';
import { VisualizationStore } from '../../../../../background/stores/visualization-store';
import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { IBaseStore } from '../../../../../common/istore';
import { StoreActionMessageCreator } from '../../../../../common/message-creators/store-action-message-creator';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { ICommandStoreData } from '../../../../../common/types/store-data/icommand-store-data';
import { ILaunchPanelStoreData } from '../../../../../common/types/store-data/ilaunch-panel-store-data';
import { IVisualizationStoreData } from '../../../../../common/types/store-data/ivisualization-store-data';
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

        const popupViewStoreActionCreatorMock = Mock.ofType(StoreActionMessageCreator);

        const visualizationStoreMock = Mock.ofType<IBaseStore<IVisualizationStoreData>>(VisualizationStore);
        const commandStoreMock = Mock.ofType<IBaseStore<ICommandStoreData>>(CommandStore);
        const launchPanelStateStoreMock = Mock.ofType<IBaseStore<ILaunchPanelStoreData>>(LaunchPanelStore);
        const featureFlagStoreMock = Mock.ofType<IBaseStore<FeatureFlagStoreData>>(FeatureFlagStore);

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
            .setup(r => r(
                It.isValue(
                    <PopupViewWithStoreSubscription
                        deps={deps}
                        title={expectedTitle}
                        subtitle={expectedSubtitle}
                        storeActionCreator={popupViewStoreActionCreatorMock.object}
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
                        storesHub={null}
                    />),
                container))
            .verifiable();

        const renderer = new MainRenderer(
            deps,
            {
                diagnosticViewClickHandler: diagnosticViewClickHandlerMock.object,
                popupViewControllerHandler: gettingStartedDialogHandlerMock.object,
                launchPanelHeaderClickHandler: feedbackMenuClickhandlerMock.object,
                supportLinkHandler: supportLinkHandlerMock.object,
            },
            popupViewStoreActionCreatorMock.object,
            null,
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

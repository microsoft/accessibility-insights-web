// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createRoot }from 'react-dom/client';
import { IMock, Mock } from 'typemoq';
import { DropdownClickHandler } from '../../../../common/dropdown-click-handler';
import { DiagnosticViewToggleFactory } from '../../../../popup/components/diagnostic-view-toggle-factory';
import { DiagnosticViewClickHandler } from '../../../../popup/handlers/diagnostic-view-toggle-click-handler';
import { LaunchPanelHeaderClickHandler } from '../../../../popup/handlers/launch-panel-header-click-handler';
import { PopupViewControllerHandler } from '../../../../popup/handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from '../../../../popup/launch-pad-row-configuration-factory';
import { MainRenderer, MainRendererDeps } from '../../../../popup/main-renderer';
import { TestDocumentCreator } from '../../common/test-document-creator';

jest.mock('common/components/theme');
jest.mock('popup/components/popup-view');
describe('MainRenderer', () => {
    test('render', () => {
        const fakeDocument = TestDocumentCreator.createTestDocument(
            '<div id="popup-container"></div>',
        );

        const diagnosticViewClickHandlerMock = Mock.ofType(DiagnosticViewClickHandler);
        const gettingStartedDialogHandlerMock = Mock.ofType(PopupViewControllerHandler);
        const feedbackMenuClickhandlerMock = Mock.ofType(LaunchPanelHeaderClickHandler);
        const launchPadRowConfigurationFactoryMock = Mock.ofType(LaunchPadRowConfigurationFactory);
        const diagnosticViewToggleFactoryMock = Mock.ofType(DiagnosticViewToggleFactory);
        const dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

        const renderMock: IMock<typeof createRoot> = Mock.ofInstance(() => null);

        const popupWindowMock = Mock.ofInstance(window);
        const hasAccess = true;
        const targetTabUrl = 'url';

        const deps: MainRendererDeps = Mock.ofType<MainRendererDeps>().object;
        const createRootMock = jest.fn(createRoot);
        renderMock
            .setup(r =>
                r(
                    fakeDocument.getElementById('popup-container'),
                ),
        ).
            returns(createRootMock)
            .verifiable();

        const renderer = new MainRenderer(
            deps,
            {
                diagnosticViewClickHandler: diagnosticViewClickHandlerMock.object,
                popupViewControllerHandler: gettingStartedDialogHandlerMock.object,
                launchPanelHeaderClickHandler: feedbackMenuClickhandlerMock.object,
            },
            renderMock.object,
            fakeDocument,
            popupWindowMock.object,
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

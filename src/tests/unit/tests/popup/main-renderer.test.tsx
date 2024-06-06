// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { It, Mock } from 'typemoq';
import { Theme } from '../../../../common/components/theme';
import { DropdownClickHandler } from '../../../../common/dropdown-click-handler';
import { DiagnosticViewToggleFactory } from '../../../../popup/components/diagnostic-view-toggle-factory';
import { PopupViewWithStoreSubscription } from '../../../../popup/components/popup-view';
import { DiagnosticViewClickHandler } from '../../../../popup/handlers/diagnostic-view-toggle-click-handler';
import { LaunchPanelHeaderClickHandler } from '../../../../popup/handlers/launch-panel-header-click-handler';
import { PopupViewControllerHandler } from '../../../../popup/handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from '../../../../popup/launch-pad-row-configuration-factory';
import { MainRenderer, MainRendererDeps } from '../../../../popup/main-renderer';
import { TestDocumentCreator } from '../../common/test-document-creator';

describe('MainRenderer', () => {
    const expectedTitle = title;

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
        const rootMock = Mock.ofType<Root>();
        const createRootMock = Mock.ofType<typeof createRoot>();

        const popupWindowMock = Mock.ofInstance(window);
        const hasAccess = true;
        const targetTabUrl = 'url';

        const deps: MainRendererDeps = Mock.ofType<MainRendererDeps>().object;
        createRootMock
            .setup(r => r(fakeDocument.getElementById('popup-container')))
            .returns(() => {
                return rootMock.object;
            })
            .verifiable();

        rootMock
            .setup(mock =>
                mock.render(
                    It.isValue(
                        <>
                            <Theme deps={deps} />
                            <PopupViewWithStoreSubscription
                                deps={deps}
                                title={expectedTitle}
                                popupHandlers={{
                                    diagnosticViewClickHandler:
                                        diagnosticViewClickHandlerMock.object,
                                    popupViewControllerHandler:
                                        gettingStartedDialogHandlerMock.object,
                                    launchPanelHeaderClickHandler:
                                        feedbackMenuClickhandlerMock.object,
                                }}
                                popupWindow={popupWindowMock.object}
                                targetTabUrl={targetTabUrl}
                                hasAccess={hasAccess}
                                launchPadRowConfigurationFactory={
                                    launchPadRowConfigurationFactoryMock.object
                                }
                                diagnosticViewToggleFactory={diagnosticViewToggleFactoryMock.object}
                                dropdownClickHandler={dropdownClickHandlerMock.object}
                            />
                        </>,
                    ),
                ),
            )
            .verifiable();

        const renderer = new MainRenderer(
            deps,
            {
                diagnosticViewClickHandler: diagnosticViewClickHandlerMock.object,
                popupViewControllerHandler: gettingStartedDialogHandlerMock.object,
                launchPanelHeaderClickHandler: feedbackMenuClickhandlerMock.object,
            },
            createRootMock.object,
            fakeDocument,
            popupWindowMock.object,
            targetTabUrl,
            hasAccess,
            launchPadRowConfigurationFactoryMock.object,
            diagnosticViewToggleFactoryMock.object,
            dropdownClickHandlerMock.object,
        );

        renderer.render();

        createRootMock.verifyAll();
        rootMock.verifyAll();
    });
});

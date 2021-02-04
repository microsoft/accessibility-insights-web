// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { PopupViewControllerHandler } from 'popup/handlers/popup-view-controller-handler';
import { It, Mock, Times } from 'typemoq';

describe('PopupViewControllerHandlerTest', () => {
    test('openAdhocToolsPanel', () => {
        const setlaunchPanelTypeMock = Mock.ofInstance(panelType => {});
        const forceUpdateMock = Mock.ofInstance(() => {});
        const testPanelType: LaunchPanelType = LaunchPanelType.AdhocToolsPanel;

        forceUpdateMock.setup(t => t()).verifiable(Times.once());

        const testSubject: PopupViewControllerHandler = new PopupViewControllerHandler();

        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        actionMessageCreatorMock
            .setup(a => a.setLaunchPanelType(testPanelType))
            .verifiable(Times.once());

        setlaunchPanelTypeMock.setup(cM => cM(testPanelType)).verifiable(Times.once());

        const component = {
            props: {
                popupHandlers: {
                    gettingStartedDialogHandler: testSubject,
                },
                actionMessageCreator: actionMessageCreatorMock.object,
            },
            setlaunchPanelType: setlaunchPanelTypeMock.object,
            forceUpdate: forceUpdateMock.object,
        };

        testSubject.openAdhocToolsPanel(component as any);
        setlaunchPanelTypeMock.verifyAll();
        forceUpdateMock.verifyAll();
    });

    test('openTogglesView', () => {
        const setlaunchPanelTypeMock = Mock.ofInstance(panelType => {});
        const forceUpdateMock = Mock.ofInstance(() => {});
        const testPanelType: LaunchPanelType = LaunchPanelType.LaunchPad;

        forceUpdateMock.setup(t => t()).verifiable(Times.once());

        const testSubject: PopupViewControllerHandler = new PopupViewControllerHandler();

        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        actionMessageCreatorMock
            .setup(a => a.setLaunchPanelType(testPanelType))
            .verifiable(Times.once());

        setlaunchPanelTypeMock.setup(cM => cM(testPanelType)).verifiable(Times.once());

        const component = {
            props: {
                popupHandlers: {
                    gettingStartedDialogHandler: testSubject,
                },
                actionMessageCreator: actionMessageCreatorMock.object,
            },
            setlaunchPanelType: setlaunchPanelTypeMock.object,
            forceUpdate: forceUpdateMock.object,
        };

        testSubject.openLaunchPad(component as any);
        setlaunchPanelTypeMock.verifyAll();
        forceUpdateMock.verifyAll();
    });

    test('triggerRerender', () => {
        const testPanelType: LaunchPanelType = LaunchPanelType.LaunchPad;
        const setlaunchPanelTypeMock = Mock.ofInstance(panelType => {});
        setlaunchPanelTypeMock.setup(t => t(It.isValue(testPanelType))).verifiable();

        const forceUpdateMock = Mock.ofInstance(() => {});
        forceUpdateMock.setup(t => t()).verifiable();

        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        const handler: PopupViewControllerHandler = new PopupViewControllerHandler();
        const component = {
            setlaunchPanelType: setlaunchPanelTypeMock.object,
            forceUpdate: forceUpdateMock.object,
            props: {
                actionMessageCreator: actionMessageCreatorMock.object,
            },
        };

        handler.triggerRerender(component as any, testPanelType);
        setlaunchPanelTypeMock.verifyAll();
        forceUpdateMock.verifyAll();
        actionMessageCreatorMock.verifyAll();
    });
});

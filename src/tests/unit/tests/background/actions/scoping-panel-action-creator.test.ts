// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ScopingActions } from 'background/actions/scoping-actions';
import { ScopingPanelActionCreator } from 'background/actions/scoping-panel-action-creator';
import { DetailsViewController } from 'background/details-view-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { SCOPING_CLOSE, SCOPING_OPEN } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('ScopingPanelActionCreatorTest', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let detailsViewControllerStrictMock: IMock<DetailsViewController>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(
            TelemetryEventHandler,
            MockBehavior.Strict,
        );
        detailsViewControllerStrictMock = Mock.ofType<DetailsViewController>(
            null,
            MockBehavior.Strict,
        );
    });

    it('should handle OpenPanel message', () => {
        const tabId = -1;
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(SCOPING_OPEN, payload))
            .verifiable(Times.once());

        detailsViewControllerStrictMock
            .setup(dc => dc.showDetailsView(tabId))
            .verifiable(Times.once());

        const openScopingPanelMock = createActionMock(null);
        const actionsMocks = createActionsMock(
            'openScopingPanel',
            openScopingPanelMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Scoping.OpenPanel,
            payload,
            tabId,
        );

        const newTestObject = new ScopingPanelActionCreator(
            interpreterMock.object,
            actionsMocks.object,
            telemetryEventHandlerMock.object,
            detailsViewControllerStrictMock.object,
        );

        newTestObject.registerCallbacks();

        openScopingPanelMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
        detailsViewControllerStrictMock.verifyAll();
    });

    test('should handle ClosePanel message', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(SCOPING_CLOSE, payload))
            .verifiable(Times.once());

        const closeScopingPanelActionMock = createActionMock(null);
        const actionsMocks = createActionsMock(
            'closeScopingPanel',
            closeScopingPanelActionMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Scoping.ClosePanel,
            payload,
        );

        const newTestObject = new ScopingPanelActionCreator(
            interpreterMock.object,
            actionsMocks.object,
            telemetryEventHandlerMock.object,
            detailsViewControllerStrictMock.object,
        );

        newTestObject.registerCallbacks();

        closeScopingPanelActionMock.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof ScopingActions>(
        actionName: ActionName,
        action: ScopingActions[ActionName],
    ): IMock<ScopingActions> {
        const actionsMock = Mock.ofType<ScopingActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});

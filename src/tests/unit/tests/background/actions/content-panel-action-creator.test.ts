// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ContentActionCreator } from 'background/actions/content-action-creator';
import { ContentActions, ContentPayload } from 'background/actions/content-actions';
import { DetailsViewController } from 'background/details-view-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Messages } from 'common/messages';
import { CONTENT_PANEL_CLOSED, CONTENT_PANEL_OPENED, TelemetryEventSource } from 'common/telemetry-events';
import { IMock, Mock, Times } from 'typemoq';

import { createActionMock, createInterpreterMock } from '../global-action-creators/action-creator-test-helpers';

describe('ContentPanelActionMessageCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('handles OpenPanel message', () => {
        const payload: ContentPayload = {
            contentPath: 'the path',
            telemetry: {
                triggeredBy: 'N/A',
                source: -1 as TelemetryEventSource,
            },
        };

        const tabId = -2;

        const openContentPanelMock = createActionMock(payload);
        const actionsMock = createActionsMock('openContentPanel', openContentPanelMock.object);
        const interpreterMock = createInterpreterMock(Messages.ContentPanel.OpenPanel, payload, tabId);

        const detailsViewControllerMock = Mock.ofType<DetailsViewController>();

        const testSubject = new ContentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            detailsViewControllerMock.object,
        );

        testSubject.registerCallbacks();

        openContentPanelMock.verifyAll();
        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(CONTENT_PANEL_OPENED, payload), Times.once());
        detailsViewControllerMock.verify(controller => controller.showDetailsView(tabId), Times.once());
    });

    it('handles ClosePanel message', () => {
        const payload: BaseActionPayload = {
            telemetry: {
                triggeredBy: 'N/A',
                source: -1 as TelemetryEventSource,
            },
        };

        const closeContentPanelMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('closeContentPanel', closeContentPanelMock.object);
        const interpreterMock = createInterpreterMock(Messages.ContentPanel.ClosePanel, payload);

        const testSubject = new ContentActionCreator(interpreterMock.object, actionsMock.object, telemetryEventHandlerMock.object, null);

        testSubject.registerCallbacks();

        closeContentPanelMock.verifyAll();
        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(CONTENT_PANEL_CLOSED, payload), Times.once());
    });

    function createActionsMock<ActionName extends keyof ContentActions>(
        actionName: ActionName,
        action: ContentActions[ActionName],
    ): IMock<ContentActions> {
        const actionsMock = Mock.ofType<ContentActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});

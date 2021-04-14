// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ContentActionCreator } from 'background/actions/content-action-creator';
import { ContentActions, ContentPayload } from 'background/actions/content-actions';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { Interpreter } from 'background/interpreter';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import {
    CONTENT_PANEL_CLOSED,
    CONTENT_PANEL_OPENED,
    TelemetryEventSource,
} from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { Messages } from 'common/messages';
import { tick } from 'tests/unit/common/tick';
import { IMock, Mock, Times } from 'typemoq';
import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('ContentActionMessageCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let actionsMock: IMock<ContentActions>;
    let interpreterMock: IMock<Interpreter>;
    let testSubject: ContentActionCreator;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    describe('handles OpenPanel message', () => {
        const payload: ContentPayload = {
            contentPath: 'the path',
            contentTitle: 'the name',
            telemetry: {
                triggeredBy: 'N/A',
                source: -1 as TelemetryEventSource,
            },
        };

        const tabId = -2;

        let openContentPanelMock: IMock<Action<ContentPayload>>;
        let detailsViewControllerMock: IMock<ExtensionDetailsViewController>;
        let loggerMock: IMock<Logger>;

        beforeEach(() => {
            openContentPanelMock = createActionMock(payload);
            actionsMock = createActionsMock('openContentPanel', openContentPanelMock.object);
            interpreterMock = createInterpreterMock(
                Messages.ContentPanel.OpenPanel,
                payload,
                tabId,
            );
            detailsViewControllerMock = Mock.ofType<ExtensionDetailsViewController>();
            loggerMock = Mock.ofType<Logger>();
            testSubject = new ContentActionCreator(
                interpreterMock.object,
                actionsMock.object,
                telemetryEventHandlerMock.object,
                detailsViewControllerMock.object,
                loggerMock.object,
            );
        });

        it('when showing the details view throws an error, the error should be logged', async () => {
            const errorMessage = 'error on showDetailsView';
            detailsViewControllerMock
                .setup(controller => controller.showDetailsView(tabId))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());

            testSubject.registerCallbacks();

            await tick();

            openContentPanelMock.verifyAll();
            detailsViewControllerMock.verifyAll();
            telemetryEventHandlerMock.verify(
                handler => handler.publishTelemetry(CONTENT_PANEL_OPENED, payload),
                Times.once(),
            );
            loggerMock.verify(logger => logger.error(errorMessage), Times.once());
        });

        it('when there is no error from showing the details view', async () => {
            detailsViewControllerMock
                .setup(controller => controller.showDetailsView(tabId))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            testSubject.registerCallbacks();

            await tick();

            openContentPanelMock.verifyAll();
            detailsViewControllerMock.verifyAll();
            telemetryEventHandlerMock.verify(
                handler => handler.publishTelemetry(CONTENT_PANEL_OPENED, payload),
                Times.once(),
            );
        });
    });

    it('handles ClosePanel message', () => {
        const payload: BaseActionPayload = {
            telemetry: {
                triggeredBy: 'N/A',
                source: -1 as TelemetryEventSource,
            },
        };

        const closeContentPanelMock = createActionMock<void>(undefined);
        actionsMock = createActionsMock('closeContentPanel', closeContentPanelMock.object);
        interpreterMock = createInterpreterMock(Messages.ContentPanel.ClosePanel, payload);

        testSubject = new ContentActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
            null,
        );

        testSubject.registerCallbacks();

        closeContentPanelMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(CONTENT_PANEL_CLOSED, payload),
            Times.once(),
        );
    });

    function createActionsMock<ActionName extends keyof ContentActions>(
        actionName: ActionName,
        action: ContentActions[ActionName],
    ): IMock<ContentActions> {
        const resultActionsMock = Mock.ofType<ContentActions>();
        resultActionsMock.setup(actions => actions[actionName]).returns(() => action);
        return resultActionsMock;
    }
});

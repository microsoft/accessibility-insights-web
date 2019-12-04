// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ScopingActions } from 'background/actions/scoping-actions';
import { ScopingPanelActionCreator } from 'background/actions/scoping-panel-action-creator';
import { DetailsViewController } from 'background/details-view-controller';
import { Interpreter } from 'background/interpreter';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { SCOPING_CLOSE, SCOPING_OPEN } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { createActionMock, createInterpreterMock } from '../global-action-creators/action-creator-test-helpers';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { tick } from 'tests/unit/common/tick';

describe('ScopingPanelActionCreatorTest', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let detailsViewControllerStrictMock: IMock<DetailsViewController>;
    let actionsMocks: IMock<ScopingActions>;
    let interpreterMock: IMock<Interpreter>;

    let testObject: ScopingPanelActionCreator;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        detailsViewControllerStrictMock = Mock.ofType<DetailsViewController>(undefined, MockBehavior.Strict);
    });

    describe('handles OpenPanel message', () => {
        const tabId = -1;
        const payload: BaseActionPayload = {};

        let openScopingPanelMock: IMock<Action<void>>;
        let loggerMock: IMock<Logger>;

        beforeEach(() => {
            openScopingPanelMock = createActionMock(null);
            actionsMocks = createActionsMock('openScopingPanel', openScopingPanelMock.object);
            interpreterMock = createInterpreterMock(Messages.Scoping.OpenPanel, payload, tabId);
            telemetryEventHandlerMock.setup(handler => handler.publishTelemetry(SCOPING_OPEN, payload)).verifiable(Times.once());
            loggerMock = Mock.ofType<Logger>();

            testObject = new ScopingPanelActionCreator(
                interpreterMock.object,
                actionsMocks.object,
                telemetryEventHandlerMock.object,
                detailsViewControllerStrictMock.object,
                loggerMock.object,
            );
        });

        it('when showDetailsView succeed', async () => {
            detailsViewControllerStrictMock
                .setup(controller => controller.showDetailsViewP(tabId))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            testObject.registerCallbacks();

            await tick();

            openScopingPanelMock.verifyAll();
            telemetryEventHandlerMock.verifyAll();
            detailsViewControllerStrictMock.verifyAll();
        });

        it('logs the error when showDetailsView fail', async () => {
            const errorMessage = 'error on showDetailsView';

            detailsViewControllerStrictMock
                .setup(controller => controller.showDetailsViewP(tabId))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());

            testObject.registerCallbacks();

            await tick();

            openScopingPanelMock.verifyAll();
            telemetryEventHandlerMock.verifyAll();
            detailsViewControllerStrictMock.verifyAll();
            loggerMock.verify(logger => logger.error(errorMessage), Times.once());
        });
    });

    test('handles ClosePanel message', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock.setup(tp => tp.publishTelemetry(SCOPING_CLOSE, payload)).verifiable(Times.once());

        const closeScopingPanelActionMock = createActionMock(null);
        actionsMocks = createActionsMock('closeScopingPanel', closeScopingPanelActionMock.object);
        interpreterMock = createInterpreterMock(Messages.Scoping.ClosePanel, payload);

        testObject = new ScopingPanelActionCreator(
            interpreterMock.object,
            actionsMocks.object,
            telemetryEventHandlerMock.object,
            detailsViewControllerStrictMock.object,
        );

        testObject.registerCallbacks();

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

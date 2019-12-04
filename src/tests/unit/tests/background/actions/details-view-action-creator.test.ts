// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { DetailsViewActionCreator } from 'background/actions/details-view-action-creator';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { DetailsViewController } from 'background/details-view-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { SETTINGS_PANEL_CLOSE, SETTINGS_PANEL_OPEN, TelemetryEventSource, TriggeredBy } from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { IMock, Mock, Times } from 'typemoq';

import { createActionMock, createInterpreterMock } from '../global-action-creators/action-creator-test-helpers';
import { tick } from 'tests/unit/common/tick';
import { Action } from 'common/flux/action';
import { Interpreter } from 'background/interpreter';
import { Logger } from 'common/logging/logger';

describe('DetailsViewActionCreatorTest', () => {
    let detailsViewControllerMock: IMock<DetailsViewController>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    const defaultBasePayload: BaseActionPayload = {
        telemetry: {
            triggeredBy: 'test' as TriggeredBy,
            source: -1 as TelemetryEventSource,
        },
    };

    beforeEach(() => {
        detailsViewControllerMock = Mock.ofType<DetailsViewController>();
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    describe('handles SettingsPanel.OpenPanel message', () => {
        const tabId = -1;

        let openSettingsPanelMock: IMock<Action<void>>;
        let actionsMock: IMock<DetailsViewActions>;
        let interpreterMock: IMock<Interpreter>;

        beforeEach(() => {
            openSettingsPanelMock = createActionMock<void>(null);
            actionsMock = createActionsMock('openSettingsPanel', openSettingsPanelMock.object);
            interpreterMock = createInterpreterMock(Messages.SettingsPanel.OpenPanel, defaultBasePayload, tabId);
        });

        it('when showDetailsView fails', async () => {
            const errorMessage = 'error on showDetailsView';

            detailsViewControllerMock
                .setup(controller => controller.showDetailsViewP(tabId))
                .returns(() => Promise.reject(errorMessage))
                .verifiable(Times.once());

            const loggerMock = Mock.ofType<Logger>();

            const testObject = new DetailsViewActionCreator(
                interpreterMock.object,
                actionsMock.object,
                detailsViewControllerMock.object,
                telemetryEventHandlerMock.object,
                loggerMock.object,
            );

            testObject.registerCallback();

            await tick();

            openSettingsPanelMock.verifyAll();
            detailsViewControllerMock.verifyAll();
            telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(SETTINGS_PANEL_OPEN, defaultBasePayload), Times.once());
            loggerMock.verify(logger => logger.error(errorMessage), Times.once());
        });

        it('when showDetailsView succeed', async () => {
            detailsViewControllerMock
                .setup(controller => controller.showDetailsViewP(tabId))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            const testObject = new DetailsViewActionCreator(
                interpreterMock.object,
                actionsMock.object,
                detailsViewControllerMock.object,
                telemetryEventHandlerMock.object,
            );

            testObject.registerCallback();

            await tick();

            openSettingsPanelMock.verifyAll();
            detailsViewControllerMock.verifyAll();
            telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(SETTINGS_PANEL_OPEN, defaultBasePayload), Times.once());
        });
    });
    it('handles SettingsPanel.ClosePanel message', () => {
        const closeSettingsPanelMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('closeSettingsPanel', closeSettingsPanelMock.object);
        const interpreterMock = createInterpreterMock(Messages.SettingsPanel.ClosePanel, defaultBasePayload);

        const testObject = new DetailsViewActionCreator(
            interpreterMock.object,
            actionsMock.object,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallback();

        closeSettingsPanelMock.verifyAll();
        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(SETTINGS_PANEL_CLOSE, defaultBasePayload), Times.once());
    });

    it('handles Visualization.DetailsView.SetDetailsViewRightContentPanel message', () => {
        const payload: DetailsViewRightContentPanelType = 'Overview';

        const setSelectedDetailsViewRightContentPanelMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'setSelectedDetailsViewRightContentPanel',
            setSelectedDetailsViewRightContentPanelMock.object,
        );
        const interpreterMock = createInterpreterMock(Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel, payload);

        const testObject = new DetailsViewActionCreator(
            interpreterMock.object,
            actionsMock.object,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallback();

        setSelectedDetailsViewRightContentPanelMock.verifyAll();
    });

    it('handles Visualization.DetailsView.GetState message', () => {
        const getCurrentStateMock = createActionMock<void>(null);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(getStoreStateMessage(StoreNames.DetailsViewStore), null);

        const testObject = new DetailsViewActionCreator(
            interpreterMock.object,
            actionsMock.object,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallback();

        getCurrentStateMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof DetailsViewActions>(
        actionName: ActionName,
        action: DetailsViewActions[ActionName],
    ): IMock<DetailsViewActions> {
        const actionsMock = Mock.ofType<DetailsViewActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});

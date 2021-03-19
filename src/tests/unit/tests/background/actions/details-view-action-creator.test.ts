// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { DetailsViewActionCreator } from 'background/actions/details-view-action-creator';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
import { Interpreter } from 'background/interpreter';
import { SidePanel } from 'background/stores/side-panel';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import {
    PREVIEW_FEATURES_CLOSE,
    PREVIEW_FEATURES_OPEN,
    SCOPING_CLOSE,
    SCOPING_OPEN,
    SETTINGS_PANEL_CLOSE,
    SETTINGS_PANEL_OPEN,
    TelemetryEventSource,
    TriggeredBy,
} from 'common/extension-telemetry-events';
import { Action } from 'common/flux/action';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { tick } from 'tests/unit/common/tick';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('DetailsViewActionCreatorTest', () => {
    let detailsViewControllerMock: IMock<ExtensionDetailsViewController>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    const defaultBasePayload: BaseActionPayload = {
        telemetry: {
            triggeredBy: 'test' as TriggeredBy,
            source: -1 as TelemetryEventSource,
        },
    };

    beforeEach(() => {
        detailsViewControllerMock = Mock.ofType<ExtensionDetailsViewController>();
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    describe('handles open side panel message', () => {
        const tabId = -1;

        const detailsViewActionsMock: IMock<DetailsViewActions> = Mock.ofType<DetailsViewActions>(
            undefined,
            MockBehavior.Strict,
        );

        let openSidePanelMock: IMock<Action<SidePanel>>;
        let sidePanelActionsMock: IMock<SidePanelActions>;

        let interpreterMock: IMock<Interpreter>;

        describe.each`
            messageFriendlyName                     | actualMessage                         | sidePanel            | telemetryEventName
            ${'Messages.SettingsPanel.OpenPanel'}   | ${Messages.SettingsPanel.OpenPanel}   | ${'Settings'}        | ${SETTINGS_PANEL_OPEN}
            ${'Messages.PreviewFeatures.OpenPanel'} | ${Messages.PreviewFeatures.OpenPanel} | ${'PreviewFeatures'} | ${PREVIEW_FEATURES_OPEN}
            ${'Messages.Scoping.OpenPanel'}         | ${Messages.Scoping.OpenPanel}         | ${'Scoping'}         | ${SCOPING_OPEN}
        `('$messageFriendlyName', ({ actualMessage, sidePanel, telemetryEventName }) => {
            beforeEach(() => {
                openSidePanelMock = createActionMock<SidePanel>(sidePanel);
                sidePanelActionsMock = createSidePanelActionsMock(
                    'openSidePanel',
                    openSidePanelMock.object,
                );
                interpreterMock = createInterpreterMock(actualMessage, defaultBasePayload, tabId);
            });

            it('when showDetailsView succeed', async () => {
                detailsViewControllerMock
                    .setup(controller => controller.showDetailsView(tabId))
                    .returns(() => Promise.resolve())
                    .verifiable(Times.once());

                const testObject = new DetailsViewActionCreator(
                    interpreterMock.object,
                    detailsViewActionsMock.object,
                    sidePanelActionsMock.object,
                    detailsViewControllerMock.object,
                    telemetryEventHandlerMock.object,
                );

                testObject.registerCallback();

                await tick();

                openSidePanelMock.verifyAll();
                detailsViewControllerMock.verifyAll();
                telemetryEventHandlerMock.verify(
                    handler => handler.publishTelemetry(telemetryEventName, defaultBasePayload),
                    Times.once(),
                );
            });

            it('when showDetailsView fails', async () => {
                const errorMessage = 'error on showDetailsView';

                detailsViewControllerMock
                    .setup(controller => controller.showDetailsView(tabId))
                    .returns(() => Promise.reject(errorMessage))
                    .verifiable(Times.once());

                const loggerMock = Mock.ofType<Logger>();

                const testObject = new DetailsViewActionCreator(
                    interpreterMock.object,
                    detailsViewActionsMock.object,
                    sidePanelActionsMock.object,
                    detailsViewControllerMock.object,
                    telemetryEventHandlerMock.object,
                    loggerMock.object,
                );

                testObject.registerCallback();

                await tick();

                detailsViewControllerMock.verifyAll();
                openSidePanelMock.verifyAll();
                telemetryEventHandlerMock.verify(
                    handler => handler.publishTelemetry(telemetryEventName, defaultBasePayload),
                    Times.once(),
                );
                loggerMock.verify(logger => logger.error(errorMessage), Times.once());
            });
        });
    });

    describe('handles close side panel message', () => {
        it.each`
            messageFriendlyName                      | actualMessage                          | sidePanel            | telemetryEventName
            ${'Messages.SettingsPanel.ClosePanel'}   | ${Messages.SettingsPanel.ClosePanel}   | ${'Settings'}        | ${SETTINGS_PANEL_CLOSE}
            ${'Messages.PreviewFeatures.ClosePanel'} | ${Messages.PreviewFeatures.ClosePanel} | ${'PreviewFeatures'} | ${PREVIEW_FEATURES_CLOSE}
            ${'Messages.Scoping.ClosePanel'}         | ${Messages.Scoping.ClosePanel}         | ${'Scoping'}         | ${SCOPING_CLOSE}
        `('$messageFriendlyName', ({ actualMessage, sidePanel, telemetryEventName }) => {
            const closeSidePanelMock = createActionMock<SidePanel>(sidePanel);

            const sidePanelActionsMock = createSidePanelActionsMock(
                'closeSidePanel',
                closeSidePanelMock.object,
            );

            const interpreterMock = createInterpreterMock(actualMessage, defaultBasePayload);

            const testObject = new DetailsViewActionCreator(
                interpreterMock.object,
                null,
                sidePanelActionsMock.object,
                detailsViewControllerMock.object,
                telemetryEventHandlerMock.object,
            );

            testObject.registerCallback();

            closeSidePanelMock.verifyAll();
            telemetryEventHandlerMock.verify(
                handler => handler.publishTelemetry(telemetryEventName, defaultBasePayload),
                Times.once(),
            );
        });
    });

    it('handles Visualization.DetailsView.SetDetailsViewRightContentPanel message', () => {
        const payload: DetailsViewRightContentPanelType = 'Overview';

        const setSelectedDetailsViewRightContentPanelMock = createActionMock(payload);
        const detailsViewActionsMock = createDetailsViewActionsMock(
            'setSelectedDetailsViewRightContentPanel',
            setSelectedDetailsViewRightContentPanelMock.object,
        );
        const interpreterMock = createInterpreterMock(
            Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload,
        );

        const testObject = new DetailsViewActionCreator(
            interpreterMock.object,
            detailsViewActionsMock.object,
            null,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallback();

        setSelectedDetailsViewRightContentPanelMock.verifyAll();
    });

    it('handles Visualization.DetailsView.GetState message', () => {
        const getCurrentStateMock = createActionMock<void>(null);
        const detailsViewActionsMock = createDetailsViewActionsMock(
            'getCurrentState',
            getCurrentStateMock.object,
        );
        const interpreterMock = createInterpreterMock(
            getStoreStateMessage(StoreNames.DetailsViewStore),
            null,
        );

        const testObject = new DetailsViewActionCreator(
            interpreterMock.object,
            detailsViewActionsMock.object,
            null,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallback();

        getCurrentStateMock.verifyAll();
    });

    function createDetailsViewActionsMock<ActionName extends keyof DetailsViewActions>(
        actionName: ActionName,
        action: DetailsViewActions[ActionName],
    ): IMock<DetailsViewActions> {
        const actionsMock = Mock.ofType<DetailsViewActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }

    function createSidePanelActionsMock<ActionName extends keyof SidePanelActions>(
        actionName: ActionName,
        action: SidePanelActions[ActionName],
    ): IMock<SidePanelActions> {
        const actionsMock = Mock.ofType<SidePanelActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});

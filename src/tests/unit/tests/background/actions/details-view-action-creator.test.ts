// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { DetailsViewActionCreator } from 'background/actions/details-view-action-creator';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { ExtensionDetailsViewController } from 'background/extension-details-view-controller';
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
import { AsyncAction } from 'common/flux/async-action';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewRightContentPanelType } from 'common/types/store-data/details-view-right-content-panel-type';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { createAsyncActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('DetailsViewActionCreatorTest', () => {
    let detailsViewControllerMock: IMock<ExtensionDetailsViewController>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let interpreterMock: MockInterpreter;

    const defaultBasePayload: BaseActionPayload = {
        telemetry: {
            triggeredBy: 'test' as TriggeredBy,
            source: -1 as TelemetryEventSource,
        },
    };

    beforeEach(() => {
        detailsViewControllerMock = Mock.ofType<ExtensionDetailsViewController>();
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        interpreterMock = new MockInterpreter();
    });

    describe('handles open side panel message', () => {
        const tabId = -1;

        const detailsViewActionsMock: IMock<DetailsViewActions> = Mock.ofType<DetailsViewActions>(
            undefined,
            MockBehavior.Strict,
        );

        let openSidePanelMock: IMock<AsyncAction<SidePanel>>;
        let sidePanelActionsMock: IMock<SidePanelActions>;

        describe.each`
            messageFriendlyName                     | actualMessage                         | sidePanel            | telemetryEventName
            ${'Messages.SettingsPanel.OpenPanel'}   | ${Messages.SettingsPanel.OpenPanel}   | ${'Settings'}        | ${SETTINGS_PANEL_OPEN}
            ${'Messages.PreviewFeatures.OpenPanel'} | ${Messages.PreviewFeatures.OpenPanel} | ${'PreviewFeatures'} | ${PREVIEW_FEATURES_OPEN}
            ${'Messages.Scoping.OpenPanel'}         | ${Messages.Scoping.OpenPanel}         | ${'Scoping'}         | ${SCOPING_OPEN}
        `('$messageFriendlyName', ({ actualMessage, sidePanel, telemetryEventName }) => {
            beforeEach(() => {
                openSidePanelMock = createAsyncActionMock<SidePanel>(sidePanel);
                sidePanelActionsMock = createSidePanelActionsMock(
                    'openSidePanel',
                    openSidePanelMock.object,
                );
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

                await interpreterMock.simulateMessage(actualMessage, defaultBasePayload, tabId);

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

                await interpreterMock.simulateMessage(actualMessage, defaultBasePayload, tabId);

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
        `('$messageFriendlyName', async ({ actualMessage, sidePanel, telemetryEventName }) => {
            const closeSidePanelMock = createAsyncActionMock<SidePanel>(sidePanel);

            const sidePanelActionsMock = createSidePanelActionsMock(
                'closeSidePanel',
                closeSidePanelMock.object,
            );

            const testObject = new DetailsViewActionCreator(
                interpreterMock.object,
                null,
                sidePanelActionsMock.object,
                detailsViewControllerMock.object,
                telemetryEventHandlerMock.object,
            );

            testObject.registerCallback();

            await interpreterMock.simulateMessage(actualMessage, defaultBasePayload);

            closeSidePanelMock.verifyAll();
            telemetryEventHandlerMock.verify(
                handler => handler.publishTelemetry(telemetryEventName, defaultBasePayload),
                Times.once(),
            );
        });
    });

    it('handles Visualization.DetailsView.SetDetailsViewRightContentPanel message', async () => {
        const payload: DetailsViewRightContentPanelType = 'Overview';

        const setSelectedDetailsViewRightContentPanelMock = createAsyncActionMock(payload);
        const detailsViewActionsMock = createDetailsViewActionsMock(
            'setSelectedDetailsViewRightContentPanel',
            setSelectedDetailsViewRightContentPanelMock.object,
        );

        const testObject = new DetailsViewActionCreator(
            interpreterMock.object,
            detailsViewActionsMock.object,
            null,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallback();

        await interpreterMock.simulateMessage(
            Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            payload,
        );

        setSelectedDetailsViewRightContentPanelMock.verifyAll();
    });

    it('handles Visualization.DetailsView.GetState message', async () => {
        const getCurrentStateMock = createAsyncActionMock<void>(null);
        const detailsViewActionsMock = createDetailsViewActionsMock(
            'getCurrentState',
            getCurrentStateMock.object,
        );

        const testObject = new DetailsViewActionCreator(
            interpreterMock.object,
            detailsViewActionsMock.object,
            null,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );

        testObject.registerCallback();

        await interpreterMock.simulateMessage(
            getStoreStateMessage(StoreNames.DetailsViewStore),
            null,
        );

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

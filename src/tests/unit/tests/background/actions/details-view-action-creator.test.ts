// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { BaseActionPayload } from 'background/actions/action-payloads';
import { DetailsViewActionCreator } from 'background/actions/details-view-action-creator';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { DetailsViewController } from 'background/details-view-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import { SETTINGS_PANEL_CLOSE, SETTINGS_PANEL_OPEN, TelemetryEventSource, TriggeredBy } from '../../../../../common/telemetry-events';
import { DetailsViewRightContentPanelType } from '../../../../../DetailsView/components/left-nav/details-view-right-content-panel-type';

describe('DetailsViewActionCreatorTest', () => {
    let registerCallbackMock: IMock<RegisterTypeToPayloadCallback>;
    let detailsViewActionsMock: IMock<DetailsViewActions>;
    let detailsViewControllerMock: IMock<DetailsViewController>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    const defaultBasePayload: BaseActionPayload = {
        telemetry: {
            triggeredBy: 'test' as TriggeredBy,
            source: -1 as TelemetryEventSource,
        },
    };

    let testSubject: DetailsViewActionCreator;

    beforeEach(() => {
        registerCallbackMock = Mock.ofType<RegisterTypeToPayloadCallback>();
        detailsViewActionsMock = Mock.ofType<DetailsViewActions>();

        detailsViewControllerMock = Mock.ofType<DetailsViewController>();
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();

        testSubject = new DetailsViewActionCreator(
            registerCallbackMock.object,
            detailsViewActionsMock.object,
            detailsViewControllerMock.object,
            telemetryEventHandlerMock.object,
        );
    });

    test('on SettingsPanel.OpenPanel', () => {
        const openSettingsPanelMock = Mock.ofType<Action<null>>();

        detailsViewActionsMock.setup(actions => actions['openSettingsPanel']).returns(() => openSettingsPanelMock.object);

        const tabId = -1;

        registerCallbackMock
            .setup(register => register(Messages.SettingsPanel.OpenPanel, It.is(isFunction)))
            .callback((message, listener) => listener(defaultBasePayload, tabId));

        testSubject.registerCallback();

        openSettingsPanelMock.verify(action => action.invoke(null), Times.once());
        detailsViewControllerMock.verify(controller => controller.showDetailsView(tabId), Times.once());
        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(SETTINGS_PANEL_OPEN, defaultBasePayload), Times.once());
    });

    test('on SettingsPanel.ClosePanel', () => {
        const closeSeetingsPanelMock = Mock.ofType<Action<null>>();

        detailsViewActionsMock.setup(actions => actions['closeSettingsPanel']).returns(() => closeSeetingsPanelMock.object);

        const tabId = -1;

        registerCallbackMock
            .setup(register => register(Messages.SettingsPanel.ClosePanel, It.is(isFunction)))
            .callback((message, listener) => listener(defaultBasePayload, tabId));

        testSubject.registerCallback();

        closeSeetingsPanelMock.verify(action => action.invoke(null), Times.once());
        telemetryEventHandlerMock.verify(handler => handler.publishTelemetry(SETTINGS_PANEL_CLOSE, defaultBasePayload), Times.once());
    });

    test('on Visualization.DetailsView.SetDetailsViewRightContentPanel', () => {
        const setSelectedPanelMock = Mock.ofType<Action<DetailsViewRightContentPanelType>>();

        detailsViewActionsMock
            .setup(actions => actions['setSelectedDetailsViewRightContentPanel'])
            .returns(() => setSelectedPanelMock.object);

        const payload: DetailsViewRightContentPanelType = 'Overview';

        registerCallbackMock
            .setup(register => register(Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel, It.is(isFunction)))
            .callback((message, listener) => listener(payload));

        testSubject.registerCallback();

        setSelectedPanelMock.verify(action => action.invoke(payload), Times.once());
    });

    test('on Visualization.DetailsView.GetState', () => {
        const getCurrentStateMock = Mock.ofType<Action<null>>();

        detailsViewActionsMock.setup(actions => actions['getCurrentState']).returns(() => getCurrentStateMock.object);

        registerCallbackMock
            .setup(register => register(getStoreStateMessage(StoreNames.DetailsViewStore), It.is(isFunction)))
            .callback((message, listener) => listener());

        testSubject.registerCallback();

        getCurrentStateMock.verify(action => action.invoke(null), Times.once());
    });
});

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { ContentActionCreator } from 'background/actions/content-action-creator';
import { ContentActions, ContentPayload } from 'background/actions/content-actions';
import { DetailsViewController } from 'background/details-view-controller';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Action } from '../../../../../common/flux/action';
import { Messages } from '../../../../../common/messages';
import { CONTENT_PANEL_CLOSED, CONTENT_PANEL_OPENED } from '../../../../../common/telemetry-events';

describe('ContentPanelActionMessageCreator', () => {
    let typesRegistered = {};
    const registerTypeToPayloadCallback = (messageType, callback) => {
        typesRegistered[messageType] = callback;
    };

    const openContentPanelMock = Mock.ofType<Action<ContentPayload>>();
    const closeContentPanelMock = Mock.ofType<Action<void>>();
    const detailsViewControllerMock = Mock.ofType<DetailsViewController>();
    const telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();

    const contentActionsMock = Mock.ofType<ContentActions>();
    contentActionsMock.setup(cpa => cpa.openContentPanel).returns(() => openContentPanelMock.object);
    contentActionsMock.setup(cpa => cpa.closeContentPanel).returns(() => closeContentPanelMock.object);

    const tabId = 2112;
    const payload: ContentPayload = { contentPath: 'content/path' };

    let creator: ContentActionCreator = null;

    beforeEach(() => {
        typesRegistered = {};
        creator = new ContentActionCreator(
            contentActionsMock.object,
            telemetryEventHandlerMock.object,
            registerTypeToPayloadCallback,
            detailsViewControllerMock.object,
        );
        creator.registerCallbacks();

        openContentPanelMock.reset();
        closeContentPanelMock.reset();
        telemetryEventHandlerMock.reset();
        detailsViewControllerMock.reset();
    });

    it('registers Messages.ContentPanel.OpenPanel', () => {
        const callback = typesRegistered[Messages.ContentPanel.OpenPanel];
        callback(payload, tabId);

        openContentPanelMock.verify(action => action.invoke(payload), Times.once());
        detailsViewControllerMock.verify(ctrlr => ctrlr.showDetailsView(tabId), Times.once());
        telemetryEventHandlerMock.verify(pub => pub.publishTelemetry(CONTENT_PANEL_OPENED, payload), Times.once());
    });

    it('registers Messages.ContentPanel.ClosedPanel', () => {
        const callback = typesRegistered[Messages.ContentPanel.ClosePanel];
        callback(payload, tabId);

        closeContentPanelMock.verify(action => action.invoke(null), Times.once());
        telemetryEventHandlerMock.verify(pub => pub.publishTelemetry(CONTENT_PANEL_CLOSED, payload), Times.once());
    });
});

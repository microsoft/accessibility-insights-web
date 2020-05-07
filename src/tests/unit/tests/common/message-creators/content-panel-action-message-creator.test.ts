// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { It, Mock, Times } from 'typemoq';

import {
    BaseTelemetryData,
    CONTENT_HYPERLINK_OPENED,
    CONTENT_PAGE_OPENED,
    TelemetryEventSource,
    TriggeredBy,
} from '../../../../../common/extension-telemetry-events';
import { Message } from '../../../../../common/message';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';

describe('ContentPanelActionMessageCreator', () => {
    const event = Mock.ofType<MouseEvent>().object;
    const source = -1 as TelemetryEventSource;
    const triggeredBy = 'triggeredBy' as TriggeredBy;
    const contentPath = 'content/path';
    const contentTitle = 'the title';
    const href = 'http://external.link';

    const telemetryDataFactoryMock = Mock.ofType<TelemetryDataFactory>();
    const actionMessageDispatcherMock = Mock.ofType<ActionMessageDispatcher>();

    const testSubject = new ContentActionMessageCreator(
        telemetryDataFactoryMock.object,
        source,
        actionMessageDispatcherMock.object,
    );

    beforeEach(() => {
        telemetryDataFactoryMock.reset();
        actionMessageDispatcherMock.reset();
    });

    it('dispatches for openContentPage', () => {
        const telemetry = { triggeredBy, source, contentPath };
        telemetryDataFactoryMock
            .setup(tdf => tdf.withTriggeredByAndSource(event, source))
            .returns(() => telemetry);

        testSubject.openContentPage(event, contentPath);

        const message: Message = {
            payload: {
                eventName: CONTENT_PAGE_OPENED,
                telemetry,
            },
            messageType: Messages.Telemetry.Send,
        };

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(message)),
            Times.once(),
        );
    });

    it('dispatches for openContentHyperLink', () => {
        const telemetry = { triggeredBy, source, href };
        telemetryDataFactoryMock
            .setup(tdf => tdf.withTriggeredByAndSource(event, source))
            .returns(() => telemetry);

        testSubject.openContentHyperLink(event, href);

        const message: Message = {
            payload: {
                eventName: CONTENT_HYPERLINK_OPENED,
                telemetry,
            },
            messageType: Messages.Telemetry.Send,
        };
        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(message)),
            Times.once(),
        );
    });

    it('dispatches for openContentPanel', () => {
        const telemetry = { triggeredBy, source };
        telemetryDataFactoryMock
            .setup(tdf => tdf.withTriggeredByAndSource(event, source))
            .returns(() => telemetry);

        testSubject.openContentPanel(event, contentPath, contentTitle);

        const message: Message = {
            payload: {
                contentPath,
                contentTitle,
                telemetry,
            },
            messageType: Messages.ContentPanel.OpenPanel,
        };

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(message)),
            Times.once(),
        );
    });

    it('creates closeContentPanel', () => {
        const telemetry = Mock.ofType<BaseTelemetryData>().object;
        telemetryDataFactoryMock
            .setup(tdf => tdf.fromDetailsViewNoTriggeredBy())
            .returns(() => telemetry);

        testSubject.closeContentPanel();

        const message: Message = {
            payload: {
                telemetry,
            },
            messageType: Messages.ContentPanel.ClosePanel,
        };

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(message)),
            Times.once(),
        );
    });

    it('opens external links through the initiators', () => {
        const telemetry = { triggeredBy, source, href };
        telemetryDataFactoryMock
            .setup(tdf => tdf.withTriggeredByAndSource(event, source))
            .returns(() => telemetry);

        const details = {
            href,
        };

        testSubject.initiators.openExternalLink(event, details);

        const message: Message = {
            payload: {
                eventName: CONTENT_HYPERLINK_OPENED,
                telemetry,
            },
            messageType: Messages.Telemetry.Send,
        };

        actionMessageDispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(It.isValue(message)),
            Times.once(),
        );
    });
});

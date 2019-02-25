// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock } from 'typemoq';

import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import {
    SourceAndTriggeredBy,
    CONTENT_HYPERLINK_OPENED,
    CONTENT_PAGE_OPENED,
    TelemetryEventSource,
    TriggeredBy,
} from '../../../../../common/telemetry-events';

describe('ContentPanelActionMessageCreator', () => {
    const event = Mock.ofType<MouseEvent>().object;
    const tabId = 2112;
    const source = -1 as TelemetryEventSource;
    const triggeredBy = 'triggeredBy' as TriggeredBy;
    const contentPath = 'content/path';
    const href = 'http://external.link';

    let messagesPosted = [];
    const postMessage = message => messagesPosted.push(message);

    const telemetryDataFactoryMock = Mock.ofType<TelemetryDataFactory>();

    beforeEach(() => {
        messagesPosted = [];
        telemetryDataFactoryMock.reset();
    });

    const creator = new ContentActionMessageCreator(postMessage, tabId, telemetryDataFactoryMock.object, source);

    it('creates openContentPanel', () => {
        const telemetry = { triggeredBy, source };
        telemetryDataFactoryMock.setup(tdf => tdf.withTriggeredByAndSource(event, source)).returns(() => telemetry);

        creator.openContentPanel(event, contentPath);

        const expectedMessage = {
            payload: {
                contentPath,
                telemetry,
            },
            tabId,
            type: Messages.ContentPanel.OpenPanel,
        };
        expect(messagesPosted).toEqual([expectedMessage]);
    });

    it('creates closeContentPanel', () => {
        const telemetry = Mock.ofType<SourceAndTriggeredBy>().object;
        telemetryDataFactoryMock.setup(tdf => tdf.fromDetailsViewNoTriggeredBy()).returns(() => telemetry);

        creator.closeContentPanel();

        const expectedMessage = {
            payload: {
                telemetry,
            },
            tabId,
            type: Messages.ContentPanel.ClosePanel,
        };
        expect(messagesPosted).toEqual([expectedMessage]);
    });

    it('creates openContentPage', () => {
        const telemetry = { triggeredBy, source, contentPath };
        telemetryDataFactoryMock.setup(tdf => tdf.withTriggeredByAndSource(event, source)).returns(() => telemetry);

        creator.openContentPage(event, contentPath);

        const expectedMessage = {
            payload: {
                eventName: CONTENT_PAGE_OPENED,
                telemetry,
            },
            tabId,
            type: Messages.Telemetry.Send,
        };
        expect(messagesPosted).toEqual([expectedMessage]);
    });

    it('creates openContentHyperLink', () => {
        const telemetry = { triggeredBy, source, href };
        telemetryDataFactoryMock.setup(tdf => tdf.withTriggeredByAndSource(event, source)).returns(() => telemetry);

        creator.openContentHyperLink(event, href);

        const expectedMessage = {
            payload: {
                eventName: CONTENT_HYPERLINK_OPENED,
                telemetry,
            },
            tabId,
            type: Messages.Telemetry.Send,
        };
        expect(messagesPosted).toEqual([expectedMessage]);
    });
});

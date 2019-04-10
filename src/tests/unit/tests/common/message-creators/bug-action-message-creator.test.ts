// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';
import { BaseActionPayload, PayloadWithEventName } from '../../../../../background/actions/action-payloads';
import { Message } from '../../../../../common/message';
import { BugActionMessageCreator } from '../../../../../common/message-creators/bug-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import {
    FILE_ISSUE_CLICK,
    FileIssueClickService,
    FileIssueClickTelemetryData,
    SettingsOpenTelemetryData,
    TelemetryEventSource,
} from '../../../../../common/telemetry-events';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('BugActionMessageCreator', () => {
    const source: TelemetryEventSource = TelemetryEventSource.TargetPage;
    const eventStubFactory = new EventStubFactory();
    const event = eventStubFactory.createMouseClickEvent() as any;
    let testSubject: BugActionMessageCreator;
    let postMessageMock: IMock<(msg: any) => void>;
    let tabId: number;

    beforeEach(() => {
        tabId = -1;
        postMessageMock = Mock.ofInstance(message => {});
        testSubject = new BugActionMessageCreator(postMessageMock.object, tabId, new TelemetryDataFactory(), source);
    });

    test('openSettingsPanel', () => {
        const telemetry: SettingsOpenTelemetryData = {
            triggeredBy: 'mouseclick',
            source,
            sourceItem: 'fileIssueSettingsPrompt',
        };
        const payload: BaseActionPayload = {
            telemetry,
        };
        const expectedMessage: Message = {
            type: Messages.SettingsPanel.OpenPanel,
            tabId,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.openSettingsPanel(event);

        postMessageMock.verifyAll();
    });

    test('trackFileIssueClick', () => {
        const service: FileIssueClickService = 'gitHub';
        const telemetry: FileIssueClickTelemetryData = {
            triggeredBy: 'mouseclick',
            source,
            service,
        };
        const payload: PayloadWithEventName = {
            eventName: FILE_ISSUE_CLICK,
            telemetry,
        };
        const expectedMessage: Message = {
            type: Messages.Telemetry.Send,
            tabId,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.trackFileIssueClick(event, service);

        postMessageMock.verifyAll();
    });
});

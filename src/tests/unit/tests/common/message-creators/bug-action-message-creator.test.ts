import { IMock, It, Mock } from 'typemoq';

import { BaseActionPayload } from '../../../../../background/actions/action-payloads';
import { BugActionMessageCreator } from '../../../../../common/message-creators/bug-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { SettingsOpenTelemetryData, TelemetryEventSource } from '../../../../../common/telemetry-events';
import { EventStubFactory } from '../../../common/event-stub-factory';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
describe('BugActionMessageCreator', () => {
    const eventStubFactory = new EventStubFactory();
    let testSubject: BugActionMessageCreator;
    let postMessageMock: IMock<(msg: any) => void>;
    let tabId: number;

    beforeEach(() => {
        tabId = -1;
        postMessageMock = Mock.ofInstance(message => {});
        testSubject = new BugActionMessageCreator(postMessageMock.object, tabId, new TelemetryDataFactory());
    });

    test('openSettingsPanel', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const source = TelemetryEventSource.TargetPage;

        const telemetry: SettingsOpenTelemetryData = {
            triggeredBy: 'mouseclick',
            source,
            sourceItem: 'fileIssueSettingsPrompt',
        };
        const payload: BaseActionPayload = {
            telemetry,
        };
        const expectedMessage: IMessage = {
            type: Messages.SettingsPanel.OpenPanel,
            tabId,
            payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.openSettingsPanel(event, source);

        postMessageMock.verifyAll();
    });
});

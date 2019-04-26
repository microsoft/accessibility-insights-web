// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { ActionMessageDispatcher } from '../../../../../common/message-creators/action-message-dispatcher';
import { IssueFilingActionMessageCreator } from '../../../../../common/message-creators/issue-filing-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import {
    BaseTelemetryData,
    FILE_ISSUE_CLICK,
    SettingsOpenSourceItem,
    TelemetryEventSource,
    TriggeredBy,
} from '../../../../../common/telemetry-events';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingActionMessageCreator', () => {
    const source: TelemetryEventSource = TelemetryEventSource.TargetPage;
    const eventStub = new EventStubFactory().createKeypressEvent() as any;
    const telemetryStub: BaseTelemetryData = {
        triggeredBy: 'test' as TriggeredBy,
        source,
    };

    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let dispatcherMock: IMock<ActionMessageDispatcher>;

    let testSubject: IssueFilingActionMessageCreator;

    beforeEach(() => {
        telemetryFactoryMock = Mock.ofType<TelemetryDataFactory>();
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();

        testSubject = new IssueFilingActionMessageCreator(dispatcherMock.object, telemetryFactoryMock.object, source);
    });

    it('dispatch message for openSettingsPanel', () => {
        const telemetry = { ...telemetryStub, sourceItem: 'sourceItem' as SettingsOpenSourceItem };
        telemetryFactoryMock
            .setup(factory => factory.forSettingsPanelOpen(eventStub, source, 'fileIssueSettingsPrompt'))
            .returns(() => telemetry);

        dispatcherMock
            .setup(dispatcher =>
                dispatcher.dispatchMessage({
                    messageType: Messages.SettingsPanel.OpenPanel,
                    payload: {
                        telemetry,
                    },
                }),
            )
            .verifiable(Times.once());

        testSubject.openSettingsPanel(eventStub);

        dispatcherMock.verifyAll();
    });

    it('dispatch message for trackFileIssueClick', () => {
        const testService: string = 'test file issue service';
        const telemetry = { ...telemetryStub, service: testService };

        telemetryFactoryMock.setup(factory => factory.forFileIssueClick(eventStub, source, testService)).returns(() => telemetry);

        dispatcherMock.setup(dispatcher => dispatcher.sendTelemetry(FILE_ISSUE_CLICK, telemetry)).verifiable(Times.once());

        testSubject.trackFileIssueClick(eventStub, testService);

        dispatcherMock.verifyAll();
    });
});

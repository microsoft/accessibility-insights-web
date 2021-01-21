// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { IMock, It, Mock, Times } from 'typemoq';

import {
    BaseTelemetryData,
    FILE_ISSUE_CLICK,
    SettingsOpenSourceItem,
    TelemetryEventSource,
    TriggeredBy,
} from '../../../../../common/extension-telemetry-events';
import { IssueFilingActionMessageCreator } from '../../../../../common/message-creators/issue-filing-action-message-creator';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingActionMessageCreator', () => {
    const source: TelemetryEventSource = TelemetryEventSource.TargetPage;
    const eventStub = new EventStubFactory().createKeypressEvent() as any;
    const telemetryStub: BaseTelemetryData = {
        triggeredBy: 'test' as TriggeredBy,
        source,
    };

    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'engine-name',
            version: 'engine-version',
        },
        applicationProperties: {
            name: 'app-name',
            version: 'app-version',
            environmentName: 'environmentName',
        },
    };

    let telemetryFactoryMock: IMock<TelemetryDataFactory>;
    let dispatcherMock: IMock<ActionMessageDispatcher>;

    let testSubject: IssueFilingActionMessageCreator;

    beforeEach(() => {
        telemetryFactoryMock = Mock.ofType<TelemetryDataFactory>();
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();

        testSubject = new IssueFilingActionMessageCreator(
            dispatcherMock.object,
            telemetryFactoryMock.object,
            source,
        );
    });

    it('dispatches message for openSettingsPanel', () => {
        const telemetry = { ...telemetryStub, sourceItem: 'sourceItem' as SettingsOpenSourceItem };
        telemetryFactoryMock
            .setup(factory =>
                factory.forSettingsPanelOpen(eventStub, source, 'fileIssueSettingsPrompt'),
            )
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

    it('dispatches message for trackFileIssueClick', () => {
        const testService: string = 'test file issue service';
        const telemetry = { ...telemetryStub, service: testService };

        telemetryFactoryMock
            .setup(factory => factory.forFileIssueClick(eventStub, source, testService))
            .returns(() => telemetry);

        dispatcherMock
            .setup(dispatcher => dispatcher.sendTelemetry(FILE_ISSUE_CLICK, telemetry))
            .verifiable(Times.once());

        testSubject.trackFileIssueClick(eventStub, testService);

        dispatcherMock.verifyAll();
    });

    it('dispatches message for fileIssue', () => {
        const testService: string = 'test file issue service';
        const telemetry = { ...telemetryStub, service: testService };

        telemetryFactoryMock
            .setup(factory => factory.forFileIssueClick(eventStub, source, testService))
            .returns(() => telemetry);
        const issueDetailsData: CreateIssueDetailsTextData = {} as any;

        testSubject.fileIssue(eventStub, testService, issueDetailsData, toolData);

        dispatcherMock.verify(
            dispatcher =>
                dispatcher.dispatchMessage(
                    It.isValue({
                        messageType: Messages.IssueFiling.FileIssue,
                        payload: {
                            service: testService,
                            issueData: issueDetailsData,
                            telemetry,
                            toolData,
                        },
                    }),
                ),
            Times.once(),
        );
    });
});

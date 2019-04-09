// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';
import { BaseActionPayload } from '../../../../background/actions/action-payloads';
import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import * as TelemetryEvents from '../../../../common/telemetry-events';
import { SettingsOpenTelemetryData, TelemetryEventSource } from '../../../../common/telemetry-events';
import { TargetPageActionMessageCreator } from '../../../../injected/target-page-action-message-creator';
import { EventStubFactory } from '../../common/event-stub-factory';

describe('TargetPageActionMessageCreator', () => {
    const eventStubFactory = new EventStubFactory();
    let testSubject: TargetPageActionMessageCreator;
    let postMessageMock: IMock<(msg: any) => void>;
    let tabId: number;

    beforeEach(() => {
        tabId = -1;
        postMessageMock = Mock.ofInstance(message => {});
        testSubject = new TargetPageActionMessageCreator(postMessageMock.object, tabId, new TelemetryDataFactory());
    });

    test('scrollRequested', () => {
        const expectedMessage = {
            type: Messages.Visualizations.Common.ScrollRequested,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.scrollRequested();

        postMessageMock.verifyAll();
    });

    test('openIssuesDialog', () => {
        const payload = {
            eventName: TelemetryEvents.ISSUES_DIALOG_OPENED,
            telemetry: {
                source: TelemetryEventSource.TargetPage,
                triggeredBy: 'N/A',
            },
        };

        const expectedMessage = {
            type: Messages.Telemetry.Send,
            tabId: tabId,
            payload: payload,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.openIssuesDialog();

        postMessageMock.verifyAll();
    });

    test('setHoveredOverSelector', () => {
        const selector = ['some selector'];

        const expectedMessage = {
            type: Messages.Inspect.SetHoveredOverSelector,
            tabId: tabId,
            payload: selector,
        };

        postMessageMock.setup(pm => pm(It.isValue(expectedMessage))).verifiable();

        testSubject.setHoveredOverSelector(selector);

        postMessageMock.verifyAll();
    });

    test('openSettingsPanel', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;

        const telemetry: SettingsOpenTelemetryData = {
            triggeredBy: 'mouseclick',
            source: TelemetryEventSource.TargetPage,
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
});

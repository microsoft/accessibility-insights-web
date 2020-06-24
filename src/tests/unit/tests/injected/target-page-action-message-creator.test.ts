// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Mock, Times } from 'typemoq';
import * as TelemetryEvents from '../../../../common/extension-telemetry-events';
import { SettingsOpenTelemetryData } from '../../../../common/extension-telemetry-events';
import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import { TelemetryEventSource } from '../../../../common/types/telemetry-data';
import { TargetPageActionMessageCreator } from '../../../../injected/target-page-action-message-creator';
import { EventStubFactory } from '../../common/event-stub-factory';

describe('TargetPageActionMessageCreator', () => {
    const eventStubFactory = new EventStubFactory();
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
    let testSubject: TargetPageActionMessageCreator;

    beforeEach(() => {
        dispatcherMock.reset();
        testSubject = new TargetPageActionMessageCreator(
            new TelemetryDataFactory(),
            dispatcherMock.object,
        );
    });

    it('dispatches message for scrollRequested', () => {
        const expectedMessage: Message = {
            messageType: Messages.Visualizations.Common.ScrollRequested,
        };

        testSubject.scrollRequested();

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('sends telemetry for openIssuesDialog', () => {
        const eventName = TelemetryEvents.ISSUES_DIALOG_OPENED;
        const eventData: TelemetryEvents.TelemetryData = {
            source: TelemetryEventSource.TargetPage,
            triggeredBy: 'N/A',
        };

        testSubject.openIssuesDialog();

        dispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(eventName, eventData),
            Times.once(),
        );
    });

    it('dispatches message for setHoveredOverSelector', () => {
        const selector = ['some selector'];

        const expectedMessage = {
            messageType: Messages.Inspect.SetHoveredOverSelector,
            payload: selector,
        };

        testSubject.setHoveredOverSelector(selector);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('sends telemetry for copyIssueDetailsClicked', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const eventName = TelemetryEvents.COPY_ISSUE_DETAILS;
        const eventData: TelemetryEvents.TelemetryData = {
            source: TelemetryEventSource.TargetPage,
            triggeredBy: 'mouseclick',
        };

        testSubject.copyIssueDetailsClicked(event);

        dispatcherMock.verify(
            dispatcher => dispatcher.sendTelemetry(eventName, eventData),
            Times.once(),
        );
    });

    it('dispatches message for openSettingsPanel', () => {
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
            messageType: Messages.SettingsPanel.OpenPanel,
            payload,
        };

        testSubject.openSettingsPanel(event);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });
});

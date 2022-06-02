// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseActionPayload } from 'background/actions/action-payloads';
import { SendingExceptionTelemetryListener } from 'background/telemetry/sending-exception-telemetry-listener';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import {
    ErrorType,
    TelemetryEventSource,
    UnhandledErrorTelemetryData,
} from 'common/extension-telemetry-events';
import { IMock, Mock, Times } from 'typemoq';

class TestSendingExceptionTelemetryListener extends SendingExceptionTelemetryListener {
    public callPublishErrorTelemetry(telemetry: UnhandledErrorTelemetryData): void {
        this.publishErrorTelemetry(telemetry);
    }
}

describe(SendingExceptionTelemetryListener, () => {
    const telemetryType: string = 'unhandledError';
    const exceptionSource: TelemetryEventSource = TelemetryEventSource.AdHocTools;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let errorMessageStub: string;
    let stackTraceStub: string;
    let sourceStub: TelemetryEventSource;
    let errorTypeStub: ErrorType;
    let telemetryStub: UnhandledErrorTelemetryData;
    let expectedPayload: BaseActionPayload;
    let testSubject: TestSendingExceptionTelemetryListener;

    beforeEach(async () => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        errorMessageStub = 'Error message';
        stackTraceStub = 'Stack trace';
        sourceStub = TelemetryEventSource.AdHocTools;
        errorTypeStub = ErrorType.ConsoleError;
        telemetryStub = {
            message: errorMessageStub,
            stackTrace: stackTraceStub,
            source: sourceStub,
            errorType: errorTypeStub,
        };
        expectedPayload = { telemetry: telemetryStub };

        testSubject = new TestSendingExceptionTelemetryListener(
            telemetryEventHandlerMock.object,
            exceptionSource,
        );
    });

    afterEach(() => {
        telemetryEventHandlerMock.verifyAll();
    });

    test('sends correct telemetry payload', () => {
        telemetryEventHandlerMock
            .setup(t => t.publishTelemetry(telemetryType, expectedPayload))
            .verifiable(Times.once());

        testSubject.callPublishErrorTelemetry(telemetryStub);
    });
});

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ErrorType,
    TelemetryEventSource,
    UnhandledErrorTelemetryData,
} from 'common/extension-telemetry-events';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import { ForwardingExceptionTelemetryListener } from 'common/telemetry/forwarding-exception-telemetry-listener';
import { IMock, Mock, Times } from 'typemoq';

class TestForwardingExceptionTelemetryListener extends ForwardingExceptionTelemetryListener {
    public callPublishErrorTelemetry(telemetry: UnhandledErrorTelemetryData): void {
        this.publishErrorTelemetry(telemetry);
    }
}

describe(ForwardingExceptionTelemetryListener, () => {
    const exceptionSource: TelemetryEventSource = TelemetryEventSource.Background;
    const telemetryType: string = 'unhandledError';
    let actionMessageDispatcherMock: IMock<RemoteActionMessageDispatcher>;
    let errorMessageStub: string;
    let stackTraceStub: string;
    let sourceStub: TelemetryEventSource;
    let errorTypeStub: ErrorType;
    let telemetryStub: UnhandledErrorTelemetryData;
    let testSubject: TestForwardingExceptionTelemetryListener;

    beforeEach(async () => {
        actionMessageDispatcherMock = Mock.ofType<RemoteActionMessageDispatcher>();
        errorMessageStub = 'Error message';
        stackTraceStub = 'Stack trace';
        sourceStub = exceptionSource;
        errorTypeStub = ErrorType.ConsoleError;
        telemetryStub = {
            message: errorMessageStub,
            stackTrace: stackTraceStub,
            source: sourceStub,
            errorType: errorTypeStub,
        };

        testSubject = new TestForwardingExceptionTelemetryListener(
            actionMessageDispatcherMock.object,
            exceptionSource,
        );
    });

    afterEach(() => {
        actionMessageDispatcherMock.verifyAll();
    });

    test('sends correct telemetry payload', () => {
        actionMessageDispatcherMock
            .setup(a => a.sendTelemetry(telemetryType, telemetryStub))
            .verifiable(Times.once());

        testSubject.callPublishErrorTelemetry(telemetryStub);
    });
});

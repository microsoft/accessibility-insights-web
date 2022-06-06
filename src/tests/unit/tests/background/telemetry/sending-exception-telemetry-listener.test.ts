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
import { Logger } from 'common/logging/logger';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { IMock, It, Mock, Times } from 'typemoq';

describe(SendingExceptionTelemetryListener, () => {
    const telemetryType: string = 'unhandledError';
    const exceptionSource: TelemetryEventSource = TelemetryEventSource.AdHocTools;
    let telemetrySanitizerMock: IMock<ExceptionTelemetrySanitizer>;
    let loggingFunctionMock: IMock<(message: string, error: Error) => void>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let loggerStub: Logger;
    let errorMessageStub: string;
    let errorStub: Error;
    let stackTraceStub: string;
    let sourceStub: TelemetryEventSource;
    let errorTypeStub: ErrorType;
    let telemetryStub: UnhandledErrorTelemetryData;
    let expectedPayload: BaseActionPayload;
    let testSubject: SendingExceptionTelemetryListener;

    beforeEach(async () => {
        telemetrySanitizerMock = Mock.ofType<ExceptionTelemetrySanitizer>();
        telemetrySanitizerMock
            .setup(m => m.sanitizeTelemetryData(It.isAny()))
            .returns(t => t)
            .verifiable(Times.once());
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
        loggingFunctionMock = Mock.ofType<(message: string, error: Error) => void>();
        loggerStub = { error: loggingFunctionMock.object } as Logger;
        errorMessageStub = 'Error message';
        errorStub = new Error();
        stackTraceStub = 'Stack trace';
        errorStub.stack = stackTraceStub;
        sourceStub = TelemetryEventSource.AdHocTools;
        errorTypeStub = ErrorType.LoggerError;
        telemetryStub = {
            message: errorMessageStub,
            stackTrace: stackTraceStub,
            source: sourceStub,
            errorType: errorTypeStub,
        };
        expectedPayload = { telemetry: telemetryStub };

        testSubject = new SendingExceptionTelemetryListener(
            telemetryEventHandlerMock.object,
            exceptionSource,
            telemetrySanitizerMock.object,
        );

        testSubject.initialize(loggerStub);
    });

    afterEach(() => {
        telemetryEventHandlerMock.verifyAll();
    });

    test('sends correct telemetry payload', () => {
        telemetryEventHandlerMock
            .setup(t => t.publishTelemetry(telemetryType, expectedPayload))
            .verifiable(Times.once());

        loggerStub.error(errorMessageStub, errorStub);
    });
});
